import { ILead } from '../../types';
import { statusColors, sourceColors, formatDate } from '../../utils';
import { Modal } from '../ui/Modal';

interface LeadDetailProps {
  lead: ILead | null;
  onClose: () => void;
  onEdit: (lead: ILead) => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({ lead, onClose, onEdit }) => {
  if (!lead) return null;

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );

  return (
    <Modal isOpen={!!lead} onClose={onClose} title="Lead Details">
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Row label="Name" value={lead.name} />
          <Row label="Email" value={
            <a href={`mailto:${lead.email}`} className="text-brand-400 hover:underline">
              {lead.email}
            </a>
          } />
          <Row label="Status" value={
            <span className={`badge ${statusColors[lead.status]}`}>{lead.status}</span>
          } />
          <Row label="Source" value={
            <span className={`badge ${sourceColors[lead.source]}`}>{lead.source}</span>
          } />
          <Row label="Assigned To" value={lead.assignedTo?.name ?? '—'} />
          <Row label="Created By" value={lead.createdBy?.name ?? '—'} />
          <Row label="Created At" value={formatDate(lead.createdAt)} />
          <Row label="Updated At" value={formatDate(lead.updatedAt)} />
        </div>

        {lead.notes && (
          <div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Notes</span>
            <p className="mt-1 text-sm text-slate-300 bg-slate-800 rounded-lg px-3 py-2 leading-relaxed">
              {lead.notes}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Close</button>
          <button onClick={() => onEdit(lead)} className="btn-primary flex-1">Edit Lead</button>
        </div>
      </div>
    </Modal>
  );
};