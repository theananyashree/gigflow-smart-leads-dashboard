import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';

export const AppLayout: React.FC = () => (
  <div className="flex min-h-screen bg-slate-950">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0">
      <MobileHeader />
      <main className="flex-1 p-4 md:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  </div>
);