import { useState, useEffect } from 'react';
import { ILead, ILeadForm, LeadStatus, LeadSource, UserRole } from '../../types';
import { leadsApi } from '../../api/leads';
import { authApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { Spinner } from '../ui/Spinner';
import toast from 'react-hot-toast';

interface LeadFormProps {
  lead?: ILead;
  onSuccess: () => void;
  onCancel: () => void;
}

const defaultForm: ILeadForm = {
  name: '',
  email: '',
  status: LeadStatus.NEW,
  source: LeadSource.WEBSITE,
  notes: '',
  assignedTo: '',
};

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const isEdit = !!lead;
  const [form, setForm] = useState<ILeadForm>(
    lead
      ? {
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
          notes: lead.notes ?? '',
          assignedTo: lead.assignedTo?._id ?? '',
        }
      : defaultForm
  );
  const [errors, setErrors] = useState<Partial<ILeadForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      authApi.getUsers().then((res) => setUsers(res.data.data ?? []));
    }
  }, [user?.role]);

  const validate = (): boolean => {
    const errs: Partial<ILeadForm> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email format';

    if (!form.source) errs.source = 'Source is required';
    if (form.notes && form.notes.length > 500) errs.notes = 'Max 500 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ILeadForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = { ...form, assignedTo: form.assignedTo || undefined };
      if (isEdit) {
        await leadsApi.update(lead._id, payload);
        toast.success('Lead updated');
      } else {
        await leadsApi.create(payload);
        toast.success('Lead created');
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? 'Something went wrong';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({
    label, name, error, children,
  }: { label: string; name: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" name="name" error={errors.name}>
          <input
            id="name" name="name" value={form.name} onChange={handleChange}
            className="input" placeholder="John Doe"
          />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input
            id="email" name="email" type="email" value={form.email} onChange={handleChange}
            className="input" placeholder="john@example.com"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Status" name="status">
          <select id="status" name="status" value={form.status} onChange={handleChange} className="input">
            {Object.values(LeadStatus).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Source" name="source" error={errors.source}>
          <select id="source" name="source" value={form.source} onChange={handleChange} className="input">
            <option value="">Select source</option>
            {Object.values(LeadSource).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>

      {user?.role === UserRole.ADMIN && users.length > 0 && (
        <Field label="Assign To" name="assignedTo">
          <select id="assignedTo" name="assignedTo" value={form.assignedTo} onChange={handleChange} className="input">
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name}</option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Notes (optional)" name="notes" error={errors.notes}>
        <textarea
          id="notes" name="notes" value={form.notes} onChange={handleChange}
          className="input resize-none" rows={3} placeholder="Any additional notes..."
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {isSubmitting && <Spinner size="sm" />}
          {isEdit ? 'Update Lead' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
};