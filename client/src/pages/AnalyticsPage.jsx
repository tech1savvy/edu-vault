import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, BookOpen, Target, CheckCircle } from 'lucide-react';
import './AnalyticsPage.css';

const COLORS = ['#20c997', '#ffc107', '#dc3545'];
const ROLE_COLORS = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384'];

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


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-dark min-vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 bg-dark min-vh-100">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  // Formatting Readiness Data for Recharts
  const readinessData = stats?.readinessDistribution ? [
    { name: 'Placement Ready', value: stats.readinessDistribution.ready },
    { name: 'Moderate', value: stats.readinessDistribution.moderate },
    { name: 'At Risk', value: stats.readinessDistribution.atRisk },
  ] : [];

  return (
    <div className="analytics-page container-fluid py-5 bg-dark text-light min-vh-100">
      <header className="mb-5 text-center">
        <h1 className="text-light fw-bold">🎓 Institutional Analytics Dashboard</h1>
        <p className="text-secondary fs-5">Placement readiness & platform utilization overview</p>
      </header>

      {/* Top Banner KPI Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 hover-lift">
            <div className="card-body text-center py-4">
              <Users className="text-primary mb-3" size={32} />
              <h2 className="text-primary fw-bold mb-1">{stats?.totalUsers || 0}</h2>
              <p className="mb-0 text-white-50">Total Users</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 hover-lift">
            <div className="card-body text-center py-4">
              <Activity className="text-success mb-3" size={32} />
              <h2 className="text-success fw-bold mb-1">{stats?.activeUsers || 0}</h2>
              <p className="mb-0 text-white-50">Active Users</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 hover-lift">
            <div className="card-body text-center py-4">
              <BookOpen className="text-info mb-3" size={32} />
              <h2 className="text-info fw-bold mb-1">{stats?.totalJobs || 0}</h2>
              <p className="mb-0 text-white-50">Job Benchmarks</p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 hover-lift">
            <div className="card-body text-center py-4">
              <Target className="text-warning mb-3" size={32} />
              <h2 className="text-warning fw-bold mb-1">{stats?.totalMatches || 0}</h2>
              <p className="mb-0 text-white-50">AI Vector Matches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        
        {/* ML Readiness Distribution Chart */}
        <div className="col-lg-6">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 p-3">
            <div className="card-header bg-transparent border-0 d-flex align-items-center">
              <CheckCircle className="text-success me-2" size={24} />
              <h4 className="mb-0 fw-bold">Placement Readiness Distribution</h4>
            </div>
            <div className="card-body text-center" style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={readinessData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {readinessData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} itemStyle={{ color: '#fff' }} />
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Role Targeting Distribution */}
        <div className="col-lg-6">
          <div className="card h-100 bg-secondary text-light border-0 shadow-lg rounded-4 p-3">
            <div className="card-header bg-transparent border-0 d-flex align-items-center">
              <Target className="text-info me-2" size={24} />
              <h4 className="mb-0 fw-bold">Target Role Distribution</h4>
            </div>
            <div className="card-body" style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stats?.roleDistribution || []}
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#aaa' }} />
                        <YAxis stroke="#fff" tick={{ fill: '#aaa' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                            {(stats?.roleDistribution || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
        </div>
        
      </div>

      <div className="row g-4">
        {/* Top Missing Skills */}
        <div className="col-12">
            <div className="card bg-secondary text-light border-0 shadow-lg rounded-4 p-3 mb-5">
            <div className="card-header bg-transparent border-seconday border-bottom pb-3">
                <h4 className="mb-0 fw-bold">Top Missing Skills Across Batch</h4>
            </div>
            <div className="card-body mt-3">
                {stats?.topSkills && stats.topSkills.length > 0 ? (
                <div className="d-flex flex-wrap gap-3">
                    {stats.topSkills.map((skill, index) => (
                    <span key={index} className="badge bg-dark border border-secondary px-4 py-3 rounded-pill fs-6 shadow-sm">
                        {skill.name} <span className="badge bg-primary rounded-circle ms-2">{skill.count}</span>
                    </span>
                    ))}
                </div>
                ) : (
                <p className="text-white-50 fs-5">No skills data available yet.</p>
                )}
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
