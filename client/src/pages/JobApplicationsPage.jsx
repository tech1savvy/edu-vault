import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { Inbox, Hourglass, Eye, CheckCircle, XCircle, Circle } from 'lucide-react';
import './JobApplicationsPage.css';

const statusConfig = {
  pending: { icon: Hourglass, bg: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  reviewed: { icon: Eye, bg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
  shortlisted: { icon: CheckCircle, bg: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  rejected: { icon: XCircle, bg: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

const defaultStatus = { icon: Circle, bg: 'bg-gray-500/20 text-gray-300 border border-gray-500/30' };

const btnActive = {
  reviewed: 'theme-btn theme-btn-cyan text-sm',
  shortlisted: 'theme-btn theme-btn-success text-sm',
  rejected: 'theme-btn theme-btn-danger text-sm',
};

const btnInactive = {
  reviewed: 'border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50',
  shortlisted: 'border border-green-500/50 text-green-400 hover:bg-green-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50',
  rejected: 'border border-red-500/50 text-red-400 hover:bg-red-500/10 px-3 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer disabled:opacity-50',
};

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await adminApi.get(`/applications/job/${jobId}`);
        setApplications(response.data);
      } catch {
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      setUpdating(applicationId);
      await adminApi.put(`/applications/application/${applicationId}/status`, { status: newStatus });
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch {
      alert('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-cyan-500 border-t-transparent" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <button
        type="button"
        className="text-gray-100 hover:text-cyan-400 no-underline mb-3 p-0 bg-transparent border-none cursor-pointer text-base"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <header className="mb-4">
        <h1 className="text-gray-100 text-2xl font-bold">Job Applications</h1>
        <p className="text-gray-100">{applications.length} application(s)</p>
      </header>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm bg-red-500/20 text-red-400 border border-red-500/30 mb-4" role="alert">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="theme-card">
          <div className="p-4 text-center py-5">
            <Inbox className="text-gray-100 w-10 h-10 mx-auto mb-2" />
            <p className="text-gray-100 mt-2 mb-0">No applications yet.</p>
          </div>
        </div>
      ) : (
        <div className="theme-card">
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700/50 text-gray-400 text-sm">
                  <th className="py-3 px-2">Applicant</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Applied</th>
                  <th className="py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const cfg = statusConfig[app.status] || defaultStatus;
                  const StatusIcon = cfg.icon;
                  return (
                    <tr key={app.id} className="border-b border-gray-700/30 hover:bg-gray-800/50 transition">
                      <td className="py-3 px-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-semibold mr-2 flex-shrink-0">
                            {app.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{app.userName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-gray-300">{app.userEmail}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-300">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          {['reviewed', 'shortlisted', 'rejected'].map((s) => {
                            const isActive = app.status === s;
                            return (
                              <button
                                key={s}
                                type="button"
                                className={isActive ? btnActive[s] : btnInactive[s]}
                                onClick={() => handleStatusChange(app.id, s)}
                                disabled={updating === app.id}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;
