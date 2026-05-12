import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, user } = await login(email, password); // Get user object from response
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user object

      // Clear any existing local storage resume keys from previous accounts
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('resume_')) {
          localStorage.removeItem(key);
        }
      }

      // If student, fetch their existing resume data from DB and prepopulate localStorage
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
        window.location.href = '/';
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Login</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>
              <p className="text-center mt-3">
                Don't have an account? <Link to="/signup">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
