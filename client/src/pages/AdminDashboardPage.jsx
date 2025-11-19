import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css'; // Import the new stylesheet

const AdminDashboardPage = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchResults, setMatchResults] = useState({});
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
        setMatchResults((prev) => {
          const newResults = { ...prev };
          delete newResults[id];
          return newResults;
        });
      } catch (err) {
        setError('Failed to delete job description.');
        console.error('Error deleting job description:', err);
      }
    }
  };

  const handleMatchJobDescription = async (id) => {
    try {
      setLoading(true);
      const response = await adminService.matchJobDescription(id, 5);
      setMatchResults((prev) => ({
        ...prev,
        [id]: response.data,
      }));
      alert('Matching process completed. Results displayed below.');
    } catch (err) {
      setError('Failed to match job description.');
      console.error('Error matching job description:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFullSync = async () => {
    if (window.confirm('Are you sure you want to trigger a full synchronization? This can be a long-running operation.')) {
      try {
        setLoading(true);
        const response = await adminService.triggerFullSync();
        alert(response.data.message);
        console.log('Full sync response:', response.data);
      } catch (err) {
        setError('Failed to trigger full synchronization.');
        console.error('Error triggering full sync:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading...</p>
    </div>
  );

  if (error) return <div className="error-message text-danger"><h3>Error</h3><p>{error}</p></div>;
  if (!isAdmin) return <div className="access-denied text-danger"><h3>Access Denied</h3><p>Please login as an administrator.</p></div>;

  return (
    <div className="admin-dashboard container-fluid">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="actions-bar">
          <button onClick={handleCreateJobDescription} className="btn btn-success">
            <i className="bi bi-plus-lg"></i> Create Job
          </button>
          <button onClick={handleTriggerFullSync} className="btn btn-warning">
            <i className="bi bi-arrow-repeat"></i> Trigger Full Sync
          </button>
        </div>
      </header>

      <section className="mb-5">
        <h2 className="mb-3">Job Descriptions</h2>
        {jobDescriptions.length === 0 ? (
          <p>No job descriptions found.</p>
        ) : (
          <div className="row">
            {jobDescriptions.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card job-card">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text">{job.description.substring(0, 120)}...</p>
                    
                    {matchResults[job.id] && matchResults[job.id].length > 0 && (
                      <div className="match-results-container">
                        <h6><i className="bi bi-people-fill"></i> Top Matches</h6>
                        <ul className="list-group list-group-flush">
                          {matchResults[job.id].map((match, index) => (
                            <li key={index} className="list-group-item match-list-item">
                              <div className="match-user-info">
                                <strong>{match.user.name || 'N/A'}</strong><br />
                                <small>{match.user.email || 'N/A'}</small>
                              </div>
                              <span className="badge bg-primary match-score">
                                {(match.score * 100).toFixed(2)}%
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="card-footer job-card-actions">
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
