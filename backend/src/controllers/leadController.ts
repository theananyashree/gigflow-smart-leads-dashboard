import { Response } from 'express';
import Lead from '../models/Lead';
import {
  IAuthRequest,
  ICreateLeadBody,
  IUpdateLeadBody,
  ILeadQuery,
  LeadStatus,
  LeadSource,
  UserRole,
} from '../types';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { generateLeadsCSV } from '../utils/csvExport';
import { FilterQuery } from 'mongoose';
import { ILead } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildFilter = (
  query: ILeadQuery,
  userId: string,
  role: UserRole
): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  // Sales users can only see their own or assigned leads
  if (role === UserRole.SALES) {
    filter.$or = [{ createdBy: userId }, { assignedTo: userId }];
  }

  if (query.status && Object.values(LeadStatus).includes(query.status)) {
    filter.status = query.status;
  }

  if (query.source && Object.values(LeadSource).includes(query.source)) {
    filter.source = query.source;
  }

  if (query.search) {
    const regex = { $regex: query.search, $options: 'i' };
    const searchFilter = { $or: [{ name: regex }, { email: regex }] };

    if (filter.$or) {
      // Combine role filter and search filter
      filter.$and = [{ $or: filter.$or }, searchFilter];
      delete filter.$or;
    } else {
      Object.assign(filter, searchFilter);
    }
  }

  return filter;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

export const getLeads = async (req: IAuthRequest, res: Response): Promise<void> => {
  const query = req.query as ILeadQuery;
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;
  const sortDir = query.sort === 'oldest' ? 1 : -1;

  const filter = buildFilter(query, req.user!.id, req.user!.role);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: sortDir })
      .skip(skip)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  sendSuccess(res, 'Leads fetched', leads, 200, {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
};

export const getLeadById = async (req: IAuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales user can only view their own leads
  if (
    req.user!.role === UserRole.SALES &&
    lead.createdBy.toString() !== req.user!.id &&
    lead.assignedTo?.toString() !== req.user!.id
  ) {
    sendError(res, 'Access denied', 403);
    return;
  }

  sendSuccess(res, 'Lead fetched', lead);
};

export const createLead = async (req: IAuthRequest, res: Response): Promise<void> => {
  const body = req.body as ICreateLeadBody;
  const lead = await Lead.create({ ...body, createdBy: req.user!.id });
  const populated = await lead.populate('createdBy', 'name email');
  sendSuccess(res, 'Lead created', populated, 201);
};

export const updateLead = async (req: IAuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales user can only update leads they created
  if (
    req.user!.role === UserRole.SALES &&
    lead.createdBy.toString() !== req.user!.id
  ) {
    sendError(res, 'Access denied', 403);
    return;
  }

  const body = req.body as IUpdateLeadBody;
  const updated = await Lead.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  sendSuccess(res, 'Lead updated', updated);
};

export const deleteLead = async (req: IAuthRequest, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Only admin or creator can delete
  if (
    req.user!.role === UserRole.SALES &&
    lead.createdBy.toString() !== req.user!.id
  ) {
    sendError(res, 'Access denied. Only admins or creators can delete leads.', 403);
    return;
  }

  await Lead.findByIdAndDelete(req.params.id);
  sendSuccess(res, 'Lead deleted');
};

export const exportLeadsCSV = async (req: IAuthRequest, res: Response): Promise<void> => {
  const query = req.query as ILeadQuery;
  const filter = buildFilter(query, req.user!.id, req.user!.role);

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  // Cast lean result to ILead array for CSV
  const csv = generateLeadsCSV(leads as unknown as ILead[]);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
  res.status(200).send(csv);
};

export const getLeadStats = async (req: IAuthRequest, res: Response): Promise<void> => {
  const matchStage =
    req.user!.role === UserRole.SALES
      ? { $or: [{ createdBy: req.user!.id }, { assignedTo: req.user!.id }] }
      : {};

  const [statusStats, sourceStats, totalCount] = await Promise.all([
    Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Lead.aggregate([
      { $match: matchStage },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]),
    Lead.countDocuments(matchStage),
  ]);

  sendSuccess(res, 'Stats fetched', { statusStats, sourceStats, totalCount });
};