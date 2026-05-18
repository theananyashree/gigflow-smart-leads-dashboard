import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const MobileHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/leads', label: 'Leads' },
    ...(user?.role === UserRole.ADMIN ? [{ to: '/users', label: 'Users' }] : []),
  ];

  return (
    <>
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-925 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            SL
          </div>
          <span className="text-sm font-bold text-slate-100">Smart Leads</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </header>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setIsOpen(false)}>
          <nav
            className="absolute top-14 left-0 right-0 bg-slate-900 border-b border-slate-800 p-4 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-600/15 text-brand-400'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </>
  );
};