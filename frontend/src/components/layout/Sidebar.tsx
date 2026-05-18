import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { getInitials } from '../../utils';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { to: '/leads', label: 'Leads', icon: '◈' },
  { to: '/users', label: 'Users', icon: '◎', adminOnly: true },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-925 border-r border-slate-800 h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SL
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">Smart Leads</h1>
            <p className="text-xs text-slate-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter((item) => !item.adminOnly || user?.role === UserRole.ADMIN)
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center 
                          text-xs font-bold text-brand-200 shrink-0">
            {getInitials(user?.name ?? 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 transition-colors text-sm"
          >
            ⏏
          </button>
        </div>
      </div>
    </aside>
  );
};