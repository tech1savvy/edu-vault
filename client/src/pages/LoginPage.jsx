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
import './LoginPage.css';

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
    <div className="login-page">
      <div className="login-blob login-blob-tr" />
      <div className="login-blob login-blob-bl" />
      <div className="login-content">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          {error && (
            <div className="login-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email" className="login-label">Email address</label>
              <input
                type="email"
                className="login-input"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="password" className="login-label">Password</label>
              <input
                type="password"
                className="login-input"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
          <p className="login-footer">
            Don&apos;t have an account? <Link to="/signup" className="login-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
