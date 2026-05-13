import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Eye, Trash, Crosshair } from 'lucide-react';

const AdminDashboardPage = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const navigate = useNavigate();

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage in AdminDashboardPage", error);
        return null;
      }
    }
    return null;
  };

  const user = getUserFromLocalStorage();
  const isAdmin = user && user.role === 'administrator';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    fetchJobDescriptions();
  }, [isAdmin, navigate]);

  const fetchJobDescriptions = async () => {
    try {
      setLoading(true);
      const response = await adminService.getJobDescriptions();
      setJobDescriptions(response.data);
    } catch (err) {
      setError('Failed to fetch job descriptions.');
      console.error('Error fetching job descriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJobDescription = () => {
    navigate('/admin/job-descriptions/new');
  };

  const handleViewJobDescription = (id) => {
    navigate(`/admin/job-descriptions/edit/${id}`);
  };

  const handleDeleteJobDescription = async (id) => {
    if (window.confirm('Are you sure you want to delete this job description?')) {
      try {
        await adminService.deleteJobDescription(id);
        fetchJobDescriptions();
      } catch (err) {
        setError('Failed to delete job description.');
        console.error('Error deleting job description:', err);
      }
    }
  };

  const handleMatchJobDescription = (id) => {
    navigate(`/admin/job-descriptions/${id}/matches`);
  };

  const handleTriggerFullSync = async () => {
    setIsSyncing(true);
    setSyncMessage('');
    try {
      const response = await adminService.triggerFullSync();
      setSyncMessage(response.data.message);
    } catch (err) {
      setSyncMessage('Failed to trigger full synchronization.');
      console.error('Error triggering full sync:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading && !isSyncing) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-100 gap-4 theme-bg">
      <div className="theme-spinner" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-2 text-gray-100">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-400 gap-4 theme-bg">
      <h3 className="text-xl font-bold">Error</h3>
      <p>{error}</p>
    </div>
  );
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-400 gap-4 theme-bg">
      <h3 className="text-xl font-bold">Access Denied</h3>
      <p>Please login as an administrator.</p>
    </div>
  );

  return (
    <div className="theme-bg">
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content p-4">
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="theme-gradient-text mb-0 text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={handleCreateJobDescription} className="theme-btn theme-btn-success">
            <Plus className="w-4 h-4" /> Create Job
          </button>
          <button onClick={handleTriggerFullSync} className="theme-btn theme-btn-warning" disabled={isSyncing}>
            {isSyncing ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent" role="status" aria-hidden="true"></span>
                <span className="ml-2">Syncing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> Trigger Full Sync
              </>
            )}
          </button>
        </div>
      </header>
      {syncMessage && <p className="mt-3 text-center text-gray-100">{syncMessage}</p>}

      <section className="mb-5 mt-4">
        <h2 className="mb-3 text-gray-100 text-xl font-semibold">Job Descriptions</h2>
        {jobDescriptions.length === 0 && !loading ? (
          <p className="text-gray-400">No job descriptions found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobDescriptions.map((job) => (
              <div key={job.id} className="theme-card h-full flex flex-col">
                <div className="p-4 flex-1">
                  <h5 className="text-gray-100 font-semibold text-lg mb-2">{job.title}</h5>
                  <p className="text-gray-400">{job.description.substring(0, 120)}...</p>
                </div>
                <div className="theme-card-footer flex flex-wrap gap-2 p-3">
                  <button onClick={() => handleViewJobDescription(job.id)} className="theme-btn theme-btn-cyan text-sm">
                    <Eye className="w-4 h-4" /> View/Edit
                  </button>
                  <button onClick={() => handleDeleteJobDescription(job.id)} className="theme-btn theme-btn-danger text-sm">
                    <Trash className="w-4 h-4" /> Delete
                  </button>
                  <button onClick={() => handleMatchJobDescription(job.id)} className="theme-btn theme-btn-primary text-sm">
                    <Crosshair className="w-4 h-4" /> Match Resumes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
