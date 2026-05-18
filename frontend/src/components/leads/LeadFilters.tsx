import { useRef } from 'react';
import { ILeadFilters, LeadSource, LeadStatus } from '../../types';
import { leadsApi } from '../../api/leads';
import { downloadBlob } from '../../utils';
import { Spinner } from '../ui/Spinner';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface LeadFiltersProps {
  filters: ILeadFilters;
  onFilterChange: (updates: Partial<ILeadFilters>) => void;
  onAdd: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters, onFilterChange, onAdd,
}) => {
  const [exporting, setExporting] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await leadsApi.exportCSV(filters);
      downloadBlob(res.data as Blob, `leads-${Date.now()}.csv`);
      toast.success('CSV exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Top row: search + add + export */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
          <input
            ref={searchRef}
            type="text"
            defaultValue={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search by name or email…"
            className="input pl-9"
          />
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            {exporting ? <Spinner size="sm" /> : '↓'}
            CSV
          </button>
          <button onClick={onAdd} className="btn-primary flex items-center gap-2 text-sm">
            + Add Lead
          </button>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2">
        {/* Status */}
        <select
          value={filters.status ?? ''}
          onChange={(e) =>
            onFilterChange({ status: (e.target.value as LeadStatus) || undefined, page: 1 })
          }
          className="input !w-auto text-sm py-1.5"
        >
          <option value="">All Statuses</option>
          {Object.values(LeadStatus).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Source */}
        <select
          value={filters.source ?? ''}
          onChange={(e) =>
            onFilterChange({ source: (e.target.value as LeadSource) || undefined, page: 1 })
          }
          className="input !w-auto text-sm py-1.5"
        >
          <option value="">All Sources</option>
          {Object.values(LeadSource).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sort}
          onChange={(e) =>
            onFilterChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })
          }
          className="input !w-auto text-sm py-1.5"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        {/* Clear filters */}
        {(filters.status || filters.source || filters.search) && (
          <button
            onClick={() => {
              onFilterChange({ status: undefined, source: undefined, search: '', page: 1 });
              if (searchRef.current) searchRef.current.value = '';
            }}
            className="text-xs text-slate-500 hover:text-slate-300 px-2 py-1.5 
                       rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
};