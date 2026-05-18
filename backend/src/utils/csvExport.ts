import { ILead } from '../types';

const escapeCSV = (value: unknown): string => {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const generateLeadsCSV = (leads: ILead[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((lead) => [
    escapeCSV(lead.name),
    escapeCSV(lead.email),
    escapeCSV(lead.status),
    escapeCSV(lead.source),
    escapeCSV(lead.notes ?? ''),
    escapeCSV(new Date(lead.createdAt).toISOString()),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};