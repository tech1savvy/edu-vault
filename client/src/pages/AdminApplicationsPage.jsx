import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import {
  Inbox, Eye, CheckCircle, XCircle, Hourglass, Circle,
  Building2, Search, Loader2
} from 'lucide-react';

const statusConfig = {
  pending: { icon: Hourglass, bg: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  reviewed: { icon: Eye, bg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  shortlisted: { icon: CheckCircle, bg: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  rejected: { icon: XCircle, bg: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};
const defaultStatus = { icon: Circle, bg: 'bg-gray-500/20 text-gray-300 border border-gray-500/30' };

export default function AdminApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAllApplications();
        setApplications(res.data?.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = applications.filter(app => {
    const name = app.user?.name || '';
    const email = app.user?.email || '';
    const title = app.job?.title || '';
    const company = app.job?.drive?.companyName || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Inbox className="w-6 h-6 text-cyan-400" />
          All Applications
        </h1>
        <p className="text-gray-400 text-sm mt-1">{applications.length} total applications</p>
      </header>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4">{error}</div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            placeholder="Search by name, email, job, company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-cyan-500">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No applications found.</p>
        </div>
      ) : (
        <div className="theme-card overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700/50 text-gray-400 text-sm">
                <th className="py-3 px-2">Student</th>
                <th className="py-3 px-2">Job</th>
                <th className="py-3 px-2">Drive / Company</th>
                <th className="py-3 px-2">Current Stage</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Applied</th>
                <th className="py-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => {
                const cfg = statusConfig[app.status] || defaultStatus;
                const StatusIcon = cfg.icon;
                return (
                  <tr key={app.id} className="border-b border-gray-700/30 hover:bg-gray-800/50 transition">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                          {(app.user?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium">{app.user?.name || 'Unknown'}</span>
                          <p className="text-xs text-gray-500">{app.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-300 text-sm">{app.job?.title || 'Unknown'}</td>
                    <td className="py-3 px-2">
                      {app.job?.drive ? (
                        <span className="flex items-center gap-1 text-sm text-gray-300">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          {app.job.drive.companyName}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">Standalone</span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-300">
                      {app.currentStage?.name || app.currentStage?.stageType || '-'}
                    </td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
                        <StatusIcon className="w-3 h-3" />
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-400 text-sm">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => {
                          const jobDrive = app.job?.drive;
                          if (jobDrive) navigate(`/admin/drives/${jobDrive.id}`);
                        }}
                        disabled={!app.job?.drive}
                        className="text-xs text-cyan-400 hover:text-cyan-300 disabled:text-gray-600 disabled:cursor-not-allowed bg-transparent border-none cursor-pointer"
                      >
                        View Drive
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
