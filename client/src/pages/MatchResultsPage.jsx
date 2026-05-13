import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';

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
    <div className="w-full bg-gray-900 text-gray-100 min-h-screen flex justify-center items-center flex-col gap-3">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-blue-500" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-gray-100">Finding best candidates...</p>
    </div>
  );

  if (error) return (
    <div className="w-full bg-gray-900 text-gray-100 min-h-screen flex justify-center items-center flex-col gap-3">
      <h3 className="text-red-400">Error</h3>
      <p className="text-red-400">{error}</p>
    </div>
  );

  return (
    <div className="w-full bg-gray-900 text-gray-100 min-h-screen p-4">
      <header className="flex justify-between items-center mb-8 flex-wrap gap-4 border-b border-gray-700 pb-6">
        <button onClick={() => navigate('/admin/dashboard')} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300">
          <i className="bi bi-arrow-left"></i> Back to Dashboard
        </button>
        <h1 className="text-gray-100 mb-0 font-semibold text-xl text-center flex-1">Top Matches for &quot;{jobDescription?.title}&quot;</h1>
        <div />
      </header>

      {matches.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>No matching resumes found for this job description.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match, index) => (
            <div key={index} className="rounded-lg bg-gray-800 text-gray-100 h-full flex flex-col shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700 rounded-t-lg flex justify-between items-start gap-2">
                <h5 className="text-gray-100 font-semibold mb-0 truncate">{match.user.name || 'N/A'}</h5>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white whitespace-nowrap font-bold">
                  {(match.score * 100).toFixed(2)}% Match
                </span>
              </div>
              <div className="p-4 flex-1 space-y-2">
                <p className="text-gray-300 mb-0 flex items-center gap-2">
                  <i className="bi bi-envelope-fill text-cyan-400"></i> {match.user.email || 'N/A'}
                </p>
                <p className="text-gray-300 mb-0 flex items-center gap-2">
                  <i className="bi bi-person-badge-fill text-cyan-400"></i> Role: {match.user.role || 'N/A'}
                </p>
                <p className="text-gray-300 mb-0 flex items-center gap-2">
                  <i className="bi bi-person-fill text-cyan-400"></i> User ID: {match.user.id}
                </p>
              </div>
              <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700 rounded-b-lg text-right">
                <button onClick={() => navigate(`/admin/users/${match.user.id}`)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded transition-all duration-300">
                  <i className="bi bi-file-earmark-text"></i> View Student Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchResultsPage;
