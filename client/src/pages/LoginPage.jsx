import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  login,
  getHeading,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getAchievements,
  getCertifications
} from '../services/api';

const LoginPage = () => {
  const { login: authLogin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, user } = await login(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      authLogin(token, user);

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('resume_')) {
          localStorage.removeItem(key);
        }
      }

      if (user && user.role === 'student') {
        try {
          const [heading, projects, skills, exp, edu, ach, cert] = await Promise.all([
            getHeading().catch(() => ({})),
            getProjects().catch(() => []),
            getSkills().catch(() => []),
            getExperience().catch(() => []),
            getEducation().catch(() => []),
            getAchievements().catch(() => []),
            getCertifications().catch(() => [])
          ]);

          const hData = heading.data || heading || {};
          if (Object.keys(hData).length > 0) localStorage.setItem('resume_heading', JSON.stringify(hData));

          const pData = projects.data || projects || [];
          if (pData.length > 0) localStorage.setItem('resume_projects', JSON.stringify(pData));

          const sData = skills.data || skills || [];
          if (sData.length > 0) localStorage.setItem('resume_skills', JSON.stringify(sData));

          const expData = exp.data || exp || [];
          if (expData.length > 0) localStorage.setItem('resume_experiences', JSON.stringify(expData));

          const eduData = edu.data || edu || [];
          if (eduData.length > 0) localStorage.setItem('resume_education', JSON.stringify(eduData));

          const achData = ach.data || ach || [];
          if (achData.length > 0) localStorage.setItem('resume_achievements', JSON.stringify(achData));

          const certData = cert.data || cert || [];
          if (certData.length > 0) localStorage.setItem('resume_certifications', JSON.stringify(certData));
        } catch (fetchErr) {
          console.warn('Could not fetch existing resume data on login:', fetchErr);
        }
      }

      if (user && user.role === 'administrator') {
        window.location.href = '/admin/dashboard';
      } else if (user && user.role === 'mentor') {
        window.location.href = '/mentor-dashboard';
      } else if (user && user.role === 'student') {
        window.location.href = '/dashboard/profile';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
    }
  };

  return (
    <div className="theme-bg flex items-center justify-center">
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content w-full max-w-md mx-auto px-4 py-12">
        <div className="theme-card p-6">
          <h2 className="text-2xl font-bold text-center mb-6 theme-gradient-text inline-block w-full">Login</h2>
          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 bg-red-500/20 text-red-400 border border-red-500/30 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
              <input
                type="email"
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="theme-btn theme-btn-primary w-full justify-center py-2.5">Login</button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-400">
            Don&apos;t have an account? <Link to="/signup" className="text-cyan-400 hover:text-cyan-300">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
