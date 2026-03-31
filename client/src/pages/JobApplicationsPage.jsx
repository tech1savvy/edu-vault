import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import './JobApplicationsPage.css';

const JobApplicationsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'reviewed': return 'bg-info';
      case 'shortlisted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'bi-hourglass-split';
      case 'reviewed': return 'bi-eye';
      case 'shortlisted': return 'bi-check-circle';
      case 'rejected': return 'bi-x-circle';
      default: return 'bi-circle';
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5 bg-dark min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page container-fluid py-4 bg-dark text-light min-vh-100">
      <button
        type="button"
        className="btn btn-link text-decoration-none mb-3 p-0 text-light"
        onClick={() => navigate(-1)}
      >
        &larr; Back
      </button>

      <header className="mb-4">
        <h1 className="text-light">Job Applications</h1>
        <p className="text-light">{applications.length} application(s)</p>
      </header>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="card bg-secondary text-light">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox fs-1 text-light"></i>
            <p className="text-light mt-2 mb-0">No applications yet.</p>
          </div>
        </div>
      ) : (
        <div className="card bg-secondary text-light">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-placeholder me-2">
                            {app.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="fw-medium">{app.userName}</span>
                        </div>
                      </td>
                      <td>{app.userEmail}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                          <i className={`bi ${getStatusIcon(app.status)} me-1`}></i>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${app.status === 'reviewed' ? 'btn-info' : 'btn-outline-info'}`}
                            onClick={() => handleStatusChange(app.id, 'reviewed')}
                            disabled={updating === app.id}
                          >
                            Review
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${app.status === 'shortlisted' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => handleStatusChange(app.id, 'shortlisted')}
                            disabled={updating === app.id}
                          >
                            Shortlist
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${app.status === 'rejected' ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => handleStatusChange(app.id, 'rejected')}
                            disabled={updating === app.id}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicationsPage;
