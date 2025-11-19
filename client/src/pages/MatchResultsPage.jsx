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
        // First, fetch job description details to display
        const jobDescResponse = await adminService.getJobDescriptionById(id);
        setJobDescription(jobDescResponse.data);

        // Then, fetch the match results
        const matchResponse = await adminService.matchJobDescription(id, 10); // Fetch top 10 matches
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
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Finding best candidates...</p>
    </div>
  );

  if (error) return <div className="error-message text-danger"><h3>Error</h3><p>{error}</p></div>;

  return (
    <div className="match-results-page container-fluid">
      <header className="results-header">
        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-outline-light">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <h1>Top Matches for "{jobDescription?.title}"</h1>
        <div />
      </header>

      {matches.length === 0 ? (
        <div className="text-center">
          <p>No matching resumes found for this job description.</p>
        </div>
      ) : (
        <div className="row">
          {matches.map((match, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="match-card">
                <div className="match-card-header">
                  <h5 className="match-card-title">{match.user.name || 'N/A'}</h5>
                  <span className="badge bg-primary match-score">
                    {(match.score * 100).toFixed(2)}% Match
                  </span>
                </div>
                <div className="match-card-body">
                  <p className="match-card-text">
                    <i className="bi bi-envelope-fill"></i> {match.user.email || 'N/A'}
                  </p>
                  <p className="match-card-text">
                    <i className="bi bi-person-badge-fill"></i> Role: {match.user.role || 'N/A'}
                  </p>
                  <p className="match-card-text">
                    <i className="bi bi-person-fill"></i> User ID: {match.user.id}
                  </p>
                </div>
                <div className="match-card-footer">
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
