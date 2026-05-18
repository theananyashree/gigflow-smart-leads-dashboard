import { useState, FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IRegisterForm, UserRole } from '../types';
import { Spinner } from '../components/ui/Spinner';

export const RegisterPage: React.FC = () => {
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<IRegisterForm>({
    name: '', email: '', password: '', role: UserRole.SALES,
  });
  const [errors, setErrors] = useState<Partial<IRegisterForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e: Partial<IRegisterForm> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name too short';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const ok = await register(form);
    if (ok) navigate('/dashboard');
    setIsSubmitting(false);
  };

  const set = (field: keyof IRegisterForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 
                        bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 
                          rounded-2xl text-white font-bold text-lg mb-4">SL</div>
          <h1 className="text-2xl font-bold text-slate-100">Create account</h1>
          <p className="text-sm text-slate-500 mt-1">Join Smart Leads Dashboard</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label className="label" htmlFor={id}>{label}</label>
                <input
                  id={id} type={type}
                  value={form[id as keyof IRegisterForm] ?? ''}
                  onChange={set(id as keyof IRegisterForm)}
                  className="input" placeholder={placeholder}
                />
                {errors[id as keyof IRegisterForm] && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors[id as keyof IRegisterForm]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="label" htmlFor="role">Role</label>
              <select id="role" value={form.role} onChange={set('role')} className="input">
                <option value={UserRole.SALES}>Sales User</option>
                <option value={UserRole.ADMIN}>Admin</option>
              </select>
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting && <Spinner size="sm" />}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};