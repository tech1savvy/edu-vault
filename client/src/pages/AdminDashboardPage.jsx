import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-900 text-gray-100 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="mt-2 text-gray-100">Loading...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-900 text-red-400 gap-4">
      <h3 className="text-xl font-bold">Error</h3>
      <p>{error}</p>
    </div>
  );
  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-900 text-red-400 gap-4">
      <h3 className="text-xl font-bold">Access Denied</h3>
      <p>Please login as an administrator.</p>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 text-gray-100 min-h-screen p-4">
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-gray-100 mb-0 text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={handleCreateJobDescription} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300">
            <i className="bi bi-plus-lg"></i> Create Job
          </button>
          <button onClick={handleTriggerFullSync} className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-all duration-300" disabled={isSyncing}>
            {isSyncing ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-900 border-t-transparent" role="status" aria-hidden="true"></span>
                <span className="ml-2">Syncing...</span>
              </>
            ) : (
              <>
                <i className="bi bi-arrow-repeat"></i> Trigger Full Sync
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
              <div key={job.id} className="rounded-lg bg-gray-800 text-gray-100 h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                <div className="p-4 flex-1">
                  <h5 className="text-gray-100 font-semibold text-lg mb-2">{job.title}</h5>
                  <p className="text-gray-400">{job.description.substring(0, 120)}...</p>
                </div>
                <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/50 rounded-b-lg flex flex-wrap gap-2">
                  <button onClick={() => handleViewJobDescription(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded transition-all duration-300">
                    <i className="bi bi-eye"></i> View/Edit
                  </button>
                  <button onClick={() => handleDeleteJobDescription(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-all duration-300">
                    <i className="bi bi-trash"></i> Delete
                  </button>
                  <button onClick={() => handleMatchJobDescription(job.id)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-all duration-300">
                    <i className="bi bi-bullseye"></i> Match Resumes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
