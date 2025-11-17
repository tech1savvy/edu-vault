import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { useNavigate } from 'react-router-dom';
// Removed import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchResults, setMatchResults] = useState({}); // Stores match results for each job ID
  const navigate = useNavigate();

  // Directly read user from localStorage and derive isAdmin
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
      navigate('/login'); // Redirect if not admin
      return;
    }
    fetchJobDescriptions();
  }, [isAdmin, navigate]); // isAdmin is now a derived value, not from useAuth

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
    navigate(`/admin/job-descriptions/edit/${id}`); // Use edit page for viewing details
  };

  const handleDeleteJobDescription = async (id) => {
    if (window.confirm('Are you sure you want to delete this job description?')) {
      try {
        await adminService.deleteJobDescription(id);
        fetchJobDescriptions(); // Refresh the list
        setMatchResults((prev) => { // Clear match results for deleted job
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
      const response = await adminService.matchJobDescription(id, 5); // topN=5 as per plan
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

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-danger">{error}</div>;
  if (!isAdmin) return <div className="text-center mt-8 text-danger">Access Denied. Please login as an administrator.</div>;


  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <section className="mb-5">
        <h2 className="mb-3">Job Descriptions</h2>
        <button
          onClick={handleCreateJobDescription}
          className="btn btn-success mb-4"
        >
          Create New Job Description
        </button>

        {jobDescriptions.length === 0 ? (
          <p>No job descriptions found.</p>
        ) : (
          <div className="row">
            {jobDescriptions.map((job) => (
              <div key={job.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{job.title}</h5>
                    <p className="card-text text-muted">{job.description.substring(0, 100)}...</p>
                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => handleViewJobDescription(job.id)}
                        className="btn btn-info btn-sm"
                      >
                        View/Edit
                      </button>
                      <button
                        onClick={() => handleDeleteJobDescription(job.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleMatchJobDescription(job.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Match Resumes
                      </button>
                    </div>

                    {matchResults[job.id] && matchResults[job.id].length > 0 && (
                      <div className="mt-4 border-top pt-3">
                        <h6>Matching Resumes:</h6>
                        <ul className="list-group list-group-flush">
                          {matchResults[job.id].map((match, index) => (
                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <strong>User ID:</strong> {match.user.id} <br />
                                <small className="text-muted">
                                  <strong>Name:</strong> {match.user.name || 'N/A'},
                                  <strong> Email:</strong> {match.user.email || 'N/A'},
                                  <strong> Role:</strong> {match.user.role || 'N/A'}
                                </small>
                              </div>
                              <span className="badge bg-primary rounded-pill">Score: {(match.score * 100).toFixed(2)}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3">Synchronization</h2>
        <button
          onClick={handleTriggerFullSync}
          className="btn btn-warning"
        >
          Trigger Full Synchronization
        </button>
        <p className="text-muted mt-2">
          This will re-index all resumes and job descriptions for semantic search.
          This can be a long-running operation.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
