import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import './MatchResultsPage.css';

const MatchResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const jobDescResponse = await adminService.getJobDescriptionById(id);
        setJobDescription(jobDescResponse.data);

        const matchResponse = await adminService.matchJobDescription(id, 10);
        setMatches(matchResponse.data);
      } catch (err) {
        setError('Failed to fetch match results.');
        console.error('Error fetching match results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [id]);

  if (loading) return (
    <div className="match-results-page container-fluid bg-dark text-light min-vh-100 d-flex justify-content-center align-items-center flex-column gap-3">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-light">Finding best candidates...</p>
    </div>
  );

  if (error) return <div className="container-fluid bg-dark text-light min-vh-100 d-flex justify-content-center align-items-center flex-column gap-3"><h3 className="text-danger">Error</h3><p className="text-danger">{error}</p></div>;

  return (
    <div className="match-results-page container-fluid bg-dark text-light min-vh-100 p-4">
      <header className="results-header mb-4">
        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <h1 className="text-light mb-0">Top Matches for &quot;{jobDescription?.title}&quot;</h1>
        <div />
      </header>

      {matches.length === 0 ? (
        <div className="text-center text-light">
          <p>No matching resumes found for this job description.</p>
        </div>
      ) : (
        <div className="row">
          {matches.map((match, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="match-card card bg-secondary text-light h-100">
                <div className="match-card-header card-header bg-dark border-secondary d-flex justify-content-between align-items-start">
                  <h5 className="match-card-title mb-0 text-light">{match.user.name || 'N/A'}</h5>
                  <span className="badge bg-primary match-score">
                    {(match.score * 100).toFixed(2)}% Match
                  </span>
                </div>
                <div className="match-card-body card-body">
                  <p className="match-card-text mb-2 text-light">
                    <i className="bi bi-envelope-fill me-2"></i> {match.user.email || 'N/A'}
                  </p>
                  <p className="match-card-text mb-2 text-light">
                    <i className="bi bi-person-badge-fill me-2"></i> Role: {match.user.role || 'N/A'}
                  </p>
                  <p className="match-card-text mb-0 text-light">
                    <i className="bi bi-person-fill me-2"></i> User ID: {match.user.id}
                  </p>
                </div>
                <div className="match-card-footer card-footer bg-dark border-secondary text-end">
                  <button className="btn btn-sm btn-info">
                    <i className="bi bi-file-earmark-text"></i> View Full Resume
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchResultsPage;
