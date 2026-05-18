import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { leadsApi } from '../api/leads';
import { ILeadStats, LeadStatus, LeadSource } from '../types';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ui/Spinner';
import { statusColors, sourceColors } from '../utils';

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent = 'brand' }) => (
  <div className={`card p-5 border-l-2 border-l-${accent}-500`}>
    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-3xl font-bold text-slate-100 font-mono">{value}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ILeadStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsApi.getStats()
      .then((r) => setStats(r.data.data ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const getStatusCount = (status: LeadStatus) =>
    stats?.statusStats.find((s) => s._id === status)?.count ?? 0;

  const getSourceCount = (source: LeadSource) =>
    stats?.sourceStats.find((s) => s._id === source)?.count ?? 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Good day, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with your leads today.
          </p>
        </div>
        <Link to="/leads" className="btn-primary text-sm">
          View All Leads →
        </Link>
      </div>

      {/* Total */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats?.totalCount ?? 0}
          sub="All time"
          accent="brand"
        />
        <StatCard
          label="Qualified"
          value={getStatusCount(LeadStatus.QUALIFIED)}
          sub="Ready to close"
          accent="green"
        />
        <StatCard
          label="Contacted"
          value={getStatusCount(LeadStatus.CONTACTED)}
          sub="In progress"
          accent="yellow"
        />
        <StatCard
          label="Lost"
          value={getStatusCount(LeadStatus.LOST)}
          sub="Needs review"
          accent="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Leads by Status</h2>
          <div className="space-y-3">
            {Object.values(LeadStatus).map((status) => {
              const count = getStatusCount(status);
              const pct = stats?.totalCount
                ? Math.round((count / stats.totalCount) * 100)
                : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`badge ${statusColors[status]}`}>{status}</span>
                    <span className="text-xs font-mono text-slate-400">
                      {count} <span className="text-slate-600">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source breakdown */}
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Leads by Source</h2>
          <div className="space-y-3">
            {Object.values(LeadSource).map((source) => {
              const count = getSourceCount(source);
              const pct = stats?.totalCount
                ? Math.round((count / stats.totalCount) * 100)
                : 0;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`badge ${sourceColors[source]}`}>{source}</span>
                    <span className="text-xs font-mono text-slate-400">
                      {count} <span className="text-slate-600">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/leads" className="btn-secondary text-sm">📋 View Leads</Link>
          <Link to="/leads?action=new" className="btn-primary text-sm">+ Add Lead</Link>
        </div>
      </div>
    </div>
  );
};