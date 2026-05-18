import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ILead, ILeadFilters } from '../types';
import { useLeads, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadDetail } from '../components/leads/LeadDetail';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';

const DEFAULT_FILTERS: ILeadFilters = {
  page: 1,
  limit: 10,
  status: undefined,
  source: undefined,
  search: '',
  sort: 'latest',
};

export const LeadsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [rawFilters, setRawFilters] = useState<ILeadFilters>(DEFAULT_FILTERS);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [editingLead, setEditingLead] = useState<ILead | null | undefined>(undefined);
  // undefined = closed, null = create new, ILead = edit

  // Debounce only the search field
  const debouncedSearch = useDebounce(rawFilters.search, 400);

  const activeFilters: ILeadFilters = {
    ...rawFilters,
    search: debouncedSearch,
  };

  const { leads, meta, isLoading, error, refetch } = useLeads(activeFilters);
  const { deleteLead, deletingId } = useDeleteLead(refetch);

  // Auto-open add modal if ?action=new
  useEffect(() => {
    if (searchParams.get('action') === 'new') setEditingLead(null);
  }, [searchParams]);

  const handleFilterChange = useCallback((updates: Partial<ILeadFilters>) => {
    setRawFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleFormSuccess = () => {
    setEditingLead(undefined);
    refetch();
  };

  const isFormOpen = editingLead !== undefined;

  return (
    <div className="space-y-6 max-w-7xl animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Leads</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage and track all your leads in one place.
        </p>
      </div>

      {/* Filters bar */}
      <LeadFilters
        filters={rawFilters}
        onFilterChange={handleFilterChange}
        onAdd={() => setEditingLead(null)}
      />

      {/* Table */}
      <LeadTable
        leads={leads}
        meta={meta}
        isLoading={isLoading}
        error={error}
        deletingId={deletingId}
        onEdit={(lead) => setEditingLead(lead)}
        onDelete={deleteLead}
        onView={(lead) => setSelectedLead(lead)}
        onPageChange={(page) => handleFilterChange({ page })}
        onAdd={() => setEditingLead(null)}
      />

      {/* View Detail Modal */}
      <LeadDetail
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onEdit={(lead) => {
          setSelectedLead(null);
          setEditingLead(lead);
        }}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setEditingLead(undefined)}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <LeadForm
          lead={editingLead ?? undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingLead(undefined)}
        />
      </Modal>
    </div>
  );
};