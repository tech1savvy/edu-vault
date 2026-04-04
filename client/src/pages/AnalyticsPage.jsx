import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAnalytics();
      setStats(response.data);
    } catch {
      setError('Failed to fetch analytics data.');
    } finally {
      setLoading(false);
    }
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 40) return 'text-warning';
    return 'text-danger';
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

  if (error) {
    return (
      <div className="container mt-4 bg-dark min-vh-100">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page container-fluid py-4 bg-dark text-light min-vh-100">
      <header className="mb-4">
        <h1 className="text-light">Analytics Dashboard</h1>
        <p className="text-light">Platform overview and statistics</p>
      </header>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-body text-center">
              <h3 className="text-primary mb-2">{stats?.totalUsers || 0}</h3>
              <p className="mb-0 text-light">Total Users</p>
            </div>
            <div className="card-footer bg-dark border-secondary">
              <small className="text-light">
                {stats?.totalStudents || 0} students, {stats?.totalAdmins || 0} admins
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-body text-center">
              <h3 className="text-success mb-2">{stats?.activeUsers || 0}</h3>
              <p className="mb-0 text-light">Active Users</p>
            </div>
            <div className="card-footer bg-dark border-secondary">
              <small className="text-light">
                {stats?.totalUsers - stats?.activeUsers || 0} inactive/suspended
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-body text-center">
              <h3 className="text-info mb-2">{stats?.totalJobs || 0}</h3>
              <p className="mb-0 text-light">Job Descriptions</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-body text-center">
              <h3 className="text-warning mb-2">{stats?.totalMatches || 0}</h3>
              <p className="mb-0 text-light">Total Matches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-header bg-dark border-secondary">
              <h5 className="mb-0 text-light">Resume Completion</h5>
            </div>
            <div className="card-body text-center">
              <div className="completion-circle mx-auto mb-3">
                <h2 className={`mb-0 ${getCompletionColor(stats?.avgResumeCompletion || 0)}`}>
                  {stats?.avgResumeCompletion || 0}%
                </h2>
              </div>
              <p className="text-light mb-0">Average Resume Completeness</p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 bg-secondary text-light">
            <div className="card-header bg-dark border-secondary">
              <h5 className="mb-0 text-light">Match Quality</h5>
            </div>
            <div className="card-body text-center">
              <div className="completion-circle mx-auto mb-3">
                <h2 className="text-primary mb-0">
                  {stats?.avgMatchScore || 0}
                </h2>
              </div>
              <p className="text-light mb-0">Average Match Score (0-1)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-secondary text-light">
        <div className="card-header bg-dark border-secondary">
          <h5 className="mb-0 text-light">Top Skills</h5>
        </div>
        <div className="card-body">
          {stats?.topSkills && stats.topSkills.length > 0 ? (
            <div className="d-flex flex-wrap gap-2">
              {stats.topSkills.map((skill, index) => (
                <span key={index} className="badge bg-primary fs-6">
                  {skill.name} <span className="badge bg-light text-dark ms-1">{skill.count}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-light mb-0">No skills data available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
