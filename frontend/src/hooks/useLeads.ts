import { useState, useEffect, useCallback } from 'react';
import { leadsApi } from '../api/leads';
import { ILead, ILeadFilters, IPaginationMeta } from '../types';
import toast from 'react-hot-toast';

interface UseLeadsReturn {
  leads: ILead[];
  meta: IPaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeads = (filters: ILeadFilters): UseLeadsReturn => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  const refetch = useCallback(() => setTrigger((t) => t + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await leadsApi.getAll(filters);
        if (isMounted) {
          setLeads(res.data.data ?? []);
          setMeta(res.data.meta ?? null);
        }
      } catch (err: unknown) {
        if (isMounted && !controller.signal.aborted) {
          const msg = (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message ?? 'Failed to fetch leads';
          setError(msg);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetch();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [filters.page, filters.limit, filters.status, filters.source, filters.search, filters.sort, trigger]);

  return { leads, meta, isLoading, error, refetch };
};

export const useDeleteLead = (onSuccess: () => void) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteLead = async (id: string) => {
    setDeletingId(id);
    try {
      await leadsApi.delete(id);
      toast.success('Lead deleted');
      onSuccess();
    } catch {
      toast.error('Failed to delete lead');
    } finally {
      setDeletingId(null);
    }
  };

  return { deleteLead, deletingId };
};