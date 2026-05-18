import { useEffect, useState } from 'react';
import { authApi } from '../api/auth';
import { IUserListItem, UserRole } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate, getInitials } from '../utils';

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authApi.getUsers()
      .then((r) => setUsers(r.data.data ?? []))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Users</h1>
        <p className="text-sm text-slate-500 mt-1">
          All registered users in the system.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <EmptyState icon="⚠️" title="Error" description={error} />
      ) : users.length === 0 ? (
        <EmptyState icon="👥" title="No users yet" />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                {['User', 'Email', 'Role', 'Joined'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold 
                                           text-slate-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-800/60 hover:bg-slate-800/20 
                                           transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center 
                                      justify-center text-xs font-bold text-brand-200 shrink-0">
                        {getInitials(u.name)}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-400">{u.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      u.role === UserRole.ADMIN
                        ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 font-mono">
                      {formatDate(u.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};