import { LeadStatus, LeadSource } from '../types';

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const statusColors: Record<LeadStatus, string> = {
  [LeadStatus.NEW]:       'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  [LeadStatus.CONTACTED]: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  [LeadStatus.QUALIFIED]: 'bg-green-500/10 text-green-400 border border-green-500/20',
  [LeadStatus.LOST]:      'bg-red-500/10 text-red-400 border border-red-500/20',
};

export const sourceColors: Record<LeadSource, string> = {
  [LeadSource.WEBSITE]:   'bg-purple-500/10 text-purple-400',
  [LeadSource.INSTAGRAM]: 'bg-pink-500/10 text-pink-400',
  [LeadSource.REFERRAL]:  'bg-cyan-500/10 text-cyan-400',
};

export const getInitials = (name: string): string =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);