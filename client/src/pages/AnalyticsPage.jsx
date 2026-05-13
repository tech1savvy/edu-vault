import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminApi';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, Users, BookOpen, Target, CheckCircle, BarChart3 } from 'lucide-react';


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
      <div className="flex justify-center items-center theme-bg">
        <div className="theme-spinner" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theme-bg">
        <div className="theme-content px-4 pt-4">
          <div className="px-4 py-3 rounded-lg bg-red-900/50 text-red-300 border border-red-800" role="alert">{error}</div>
        </div>
      </div>
    );
  }

  const readinessData = stats?.readinessDistribution ? [
    { name: 'Placement Ready', value: stats.readinessDistribution.ready },
    { name: 'Moderate', value: stats.readinessDistribution.moderate },
    { name: 'At Risk', value: stats.readinessDistribution.atRisk },
  ] : [];

  return (
    <div className="theme-bg">
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content px-4 py-5">
      <header className="mb-5 text-center">
        <h1 className="theme-gradient-text font-bold text-3xl inline-block">🎓 Institutional Analytics Dashboard</h1>
        <p className="text-gray-400 text-lg">Placement readiness & platform utilization overview</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
        <div className="theme-kpi-card p-4 text-center">
          <Users className="text-blue-500 mb-3 inline-block" size={32} />
          <h2 className="text-blue-500 font-bold mb-1 text-3xl">{stats?.totalUsers || 0}</h2>
          <p className="mb-0 text-gray-400">Total Users</p>
        </div>

        <div className="theme-kpi-card p-4 text-center">
          <Activity className="text-green-500 mb-3 inline-block" size={32} />
          <h2 className="text-green-500 font-bold mb-1 text-3xl">{stats?.activeUsers || 0}</h2>
          <p className="mb-0 text-gray-400">Active Users</p>
        </div>

        <div className="theme-kpi-card p-4 text-center">
          <BookOpen className="text-cyan-400 mb-3 inline-block" size={32} />
          <h2 className="text-cyan-400 font-bold mb-1 text-3xl">{stats?.totalJobs || 0}</h2>
          <p className="mb-0 text-gray-400">Job Benchmarks</p>
        </div>

        <div className="theme-kpi-card p-4 text-center">
          <Target className="text-yellow-500 mb-3 inline-block" size={32} />
          <h2 className="text-yellow-500 font-bold mb-1 text-3xl">{stats?.totalMatches || 0}</h2>
          <p className="mb-0 text-gray-400">AI Vector Matches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-5">
        
        <div className="theme-card p-3 h-full">
          <div className="px-0 pt-2 pb-3 border-0 flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            <h4 className="mb-0 font-bold text-lg">Placement Readiness Distribution</h4>
          </div>
          <div className="text-center" style={{ height: '350px' }}>
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

        <div className="theme-card p-3 h-full">
          <div className="px-0 pt-2 pb-3 border-0 flex items-center gap-2">
            <Target className="text-cyan-400" size={24} />
            <h4 className="mb-0 font-bold text-lg">Target Role Distribution</h4>
          </div>
          <div className="text-center" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Pie
                      data={stats?.roleDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                      {(stats?.roleDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
        
      </div>

      <div className="theme-card p-3 mb-5">
        <div className="px-0 pt-2 pb-3 border-0 flex items-center gap-2">
          <BarChart3 className="text-purple-400" size={24} />
          <h4 className="mb-0 font-bold text-lg">Top Skills Across Batch</h4>
        </div>
        <div style={{ height: '400px' }}>
          {stats?.topSkills && stats.topSkills.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topSkills.slice(0, 10)}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" stroke="#fff" tick={{ fill: '#aaa' }} />
                <YAxis type="number" stroke="#aaa" tick={{ fill: '#aaa' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#222', borderColor: '#444' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => [`${value} students`, 'Count']}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No skills data available yet.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
