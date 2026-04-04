import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css';

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
    <div className="loading-spinner bg-dark text-light">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-light">Loading...</p>
    </div>
  );

  if (error) return <div className="error-message text-danger bg-dark"><h3>Error</h3><p>{error}</p></div>;
  if (!isAdmin) return <div className="access-denied text-danger bg-dark"><h3>Access Denied</h3><p>Please login as an administrator.</p></div>;

  return (
    <div className="admin-dashboard container-fluid bg-dark text-light min-vh-100 p-4">
      <header className="dashboard-header">
        <h1 className="text-light mb-0">Admin Dashboard</h1>
        <div className="actions-bar">
          <button onClick={handleCreateJobDescription} className="btn btn-success">
            <i className="bi bi-plus-lg"></i> Create Job
          </button>
          <button onClick={handleTriggerFullSync} className="btn btn-warning text-dark" disabled={isSyncing}>
            {isSyncing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span className="ms-2">Syncing...</span>
              </>
            ) : (
              <>
                <i className="bi bi-arrow-repeat"></i> Trigger Full Sync
              </>
            )}
          </button>
        </div>
      </header>
      {syncMessage && <p className="mt-3 text-center text-light">{syncMessage}</p>}

      <section className="mb-5 mt-4">
        <h2 className="mb-3 text-light">Job Descriptions</h2>
        {jobDescriptions.length === 0 && !loading ? (
          <p className="text-light">No job descriptions found.</p>
        ) : (
          <div className="row">
            {jobDescriptions.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card job-card bg-secondary text-light h-100">
                  <div className="card-body">
                    <h5 className="card-title text-light">{job.title}</h5>
                    <p className="card-text text-light">{job.description.substring(0, 120)}...</p>
                  </div>
                  <div className="card-footer job-card-actions bg-dark border-secondary">
                    <button onClick={() => handleViewJobDescription(job.id)} className="btn btn-info btn-sm">
                      <i className="bi bi-eye"></i> View/Edit
                    </button>
                    <button onClick={() => handleDeleteJobDescription(job.id)} className="btn btn-danger btn-sm">
                      <i className="bi bi-trash"></i> Delete
                    </button>
                    <button onClick={() => handleMatchJobDescription(job.id)} className="btn btn-primary btn-sm">
                      <i className="bi bi-bullseye"></i> Match Resumes
                    </button>
                  </div>
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
