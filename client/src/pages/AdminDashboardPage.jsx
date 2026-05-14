import { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import {
  Building2, Plus, RefreshCw, Eye, Users, Crosshair, CalendarDays,
  MapPin, GraduationCap, Loader2, LayoutDashboard, Briefcase, BarChart3, ExternalLink
} from 'lucide-react';

const statusConfig = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  active: { label: 'Active', bg: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  closed: { label: 'Closed', bg: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
};

const quickActions = [
  { label: 'Manage Drives', icon: LayoutDashboard, to: '/admin/drives', color: 'from-cyan-500 to-blue-600' },
  { label: 'All Applications', icon: Users, to: '/admin/applications', color: 'from-purple-500 to-pink-600' },
  { label: 'Users', icon: Briefcase, to: '/admin/users', color: 'from-amber-500 to-orange-600' },
  { label: 'Analytics', icon: BarChart3, to: '/admin/analytics', color: 'from-green-500 to-emerald-600' },
];

export default function AdminDashboardPage() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDrives();
      setDrives(res.data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch drives');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFullSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      await adminService.triggerFullSync();
      setSyncMessage('Sync completed successfully');
    } catch {
      setSyncMessage('Failed to trigger full synchronization.');
    } finally {
      setIsSyncing(false);
    }
  };

  const totalApplications = drives.reduce((sum, d) => sum + (d.jobDescriptions?.reduce((s, j) => s + (j.applications?.length || 0), 0) || 0), 0);
  const activeDrives = drives.filter(d => d.status === 'active').length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">Manage recruitment drives, job roles, and applications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/admin/drives')} className="theme-btn theme-btn-cyan text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Drive
          </button>
          <button onClick={handleTriggerFullSync} className="theme-btn theme-btn-warning text-sm" disabled={isSyncing}>
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? ' Syncing...' : ' Full Sync'}
          </button>
        </div>
      </header>

      {syncMessage && (
        <div className="px-4 py-3 rounded-lg text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 mb-4">{syncMessage}</div>
      )}

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4">{error}</div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="theme-card p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{drives.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total Drives</p>
        </div>
        <div className="theme-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">{activeDrives}</p>
          <p className="text-xs text-gray-400 mt-1">Active Drives</p>
        </div>
        <div className="theme-card p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">{totalApplications}</p>
          <p className="text-xs text-gray-400 mt-1">Applications</p>
        </div>
        <div className="theme-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {drives.reduce((sum, d) => sum + (d.jobDescriptions?.length || 0), 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Job Roles</p>
        </div>
      </div>

      {/* Quick Action Dashboards */}
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Dashboards</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className="theme-card p-4 text-center hover:scale-[1.02] transition cursor-pointer border-0"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mx-auto mb-2`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium">{action.label}</p>
          </button>
        ))}
      </div>

      {/* Drives List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recruitment Drives</h2>
        <button onClick={() => navigate('/admin/drives')} className="text-xs text-cyan-400 hover:text-cyan-300 bg-transparent border-none cursor-pointer flex items-center gap-1">
          View All <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {drives.length === 0 ? (
        <div className="theme-card p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-500" />
          <p className="text-gray-400">No drives yet. Click "New Drive" to get started.</p>
          <button onClick={() => navigate('/admin/drives')} className="theme-btn theme-btn-cyan text-sm mt-4">
            <Plus className="w-4 h-4" /> Create Drive
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drives.map(drive => (
            <div key={drive.id} className="theme-card flex flex-col">
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[drive.status]?.bg || ''}`}>
                    {statusConfig[drive.status]?.label || drive.status}
                  </span>
                </div>
                <h3 className="font-semibold text-lg">{drive.companyName}</h3>
                <p className="text-gray-400 text-sm">{drive.title}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                  {drive.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{drive.location}</span>}
                  {drive.driveType && <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{drive.driveType}</span>}
                  {drive.startDate && <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{new Date(drive.startDate).toLocaleDateString()}</span>}
                </div>
                <div className="flex gap-3 mt-3 text-sm">
                  <span className="text-gray-400">{drive.jobDescriptions?.length || 0} roles</span>
                  <span className="text-gray-400">{drive.stages?.length || 0} stages</span>
                </div>

                {drive.jobDescriptions?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {drive.jobDescriptions.map(job => (
                      <div key={job.id} className="text-xs bg-gray-800/50 rounded px-2 py-1 flex items-center justify-between">
                        <span className="text-gray-300 truncate">{job.title}</span>
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                          job.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-500'
                        }`}>{job.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="theme-card-footer flex flex-wrap gap-2 p-3">
                <button onClick={() => navigate(`/admin/drives/${drive.id}`)}
                  className="theme-btn theme-btn-cyan text-xs flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Pipeline
                </button>
                {drive.jobDescriptions?.length > 0 ? (
                  <button onClick={() => navigate(`/admin/job-descriptions/${drive.jobDescriptions[0].id}/matches`)}
                    className="theme-btn theme-btn-primary text-xs flex items-center gap-1">
                    <Crosshair className="w-3 h-3" /> Match
                  </button>
                ) : (
                  <button onClick={() => navigate(`/admin/drives/${drive.id}`)}
                    className="theme-btn theme-btn-primary text-xs flex items-center gap-1 opacity-50">
                    <Crosshair className="w-3 h-3" /> Match
                  </button>
                )}
                <button onClick={() => navigate(`/admin/drives/${drive.id}`)}
                  className="theme-btn theme-btn-ghost text-xs flex items-center gap-1">
                  <Users className="w-3 h-3" /> Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
