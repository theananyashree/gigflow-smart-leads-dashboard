import { body } from 'express-validator';
import { LeadStatus, LeadSource } from '../types';

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid assignedTo ID'),
];

export const updateLeadValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),

  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),

  body('assignedTo')
    .optional()
    .isMongoId().withMessage('Invalid assignedTo ID'),
];