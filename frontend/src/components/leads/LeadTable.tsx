import { ILead } from '../../types';
import { LeadCard } from './LeadCard';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { Spinner } from '../ui/Spinner';
import { IPaginationMeta } from '../../types';

interface LeadTableProps {
  leads: ILead[];
  meta: IPaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  deletingId: string | null;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  onView: (lead: ILead) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads, meta, isLoading, error, deletingId,
  onEdit, onDelete, onView, onPageChange, onAdd,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="Failed to load leads"
        description={error}
      />
    );
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No leads found"
        description="Try adjusting your filters or add a new lead."
        action={
          <button onClick={onAdd} className="btn-primary text-sm">
            + Add Lead
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              {['Name / Email', 'Status', 'Source', 'Assigned To', 'Created', 'Actions'].map(
                (col, i) => (
                  <th
                    key={col}
                    className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider
                      ${i === 2 ? 'hidden sm:table-cell' : ''}
                      ${i === 3 ? 'hidden lg:table-cell' : ''}
                      ${i === 4 ? 'hidden md:table-cell' : ''}
                    `}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadCard
                key={lead._id}
                lead={lead}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                isDeleting={deletingId === lead._id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination meta={meta} onPageChange={onPageChange} />
      )}
    </div>
  );
};