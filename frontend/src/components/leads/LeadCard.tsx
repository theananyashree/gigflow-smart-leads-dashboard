import { ILead, UserRole } from '../../types';
import { statusColors, sourceColors, formatDate } from '../../utils';
import { useAuth } from '../../context/AuthContext';

interface LeadCardProps {
  lead: ILead;
  onEdit: (lead: ILead) => void;
  onDelete: (id: string) => void;
  onView: (lead: ILead) => void;
  isDeleting: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead, onEdit, onDelete, onView, isDeleting,
}) => {
  const { user } = useAuth();
  const canEdit =
    user?.role === UserRole.ADMIN || lead.createdBy?._id === user?.id;

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group">
      {/* Name + Email */}
      <td className="px-4 py-3">
        <button
          onClick={() => onView(lead)}
          className="text-left group-hover:text-brand-400 transition-colors"
        >
          <p className="text-sm font-medium text-slate-200">{lead.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{lead.email}</p>
        </button>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span className={`badge ${statusColors[lead.status]}`}>
          {lead.status}
        </span>
      </td>

      {/* Source */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className={`badge ${sourceColors[lead.source]}`}>
          {lead.source}
        </span>
      </td>

      {/* Assigned */}
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs text-slate-400">
          {lead.assignedTo?.name ?? <span className="text-slate-600">—</span>}
        </span>
      </td>

      {/* Date */}
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-slate-500 font-mono">
          {formatDate(lead.createdAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onView(lead)}
            title="View"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 
                       hover:text-slate-200 hover:bg-slate-700 transition-colors text-xs"
          >
            👁
          </button>
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(lead)}
                title="Edit"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 
                           hover:text-brand-400 hover:bg-slate-700 transition-colors text-xs"
              >
                ✏
              </button>
              <button
                onClick={() => onDelete(lead._id)}
                disabled={isDeleting}
                title="Delete"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 
                           hover:text-red-400 hover:bg-slate-700 transition-colors text-xs
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🗑
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};