import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signup } from '../services/api';
import './SignupPage.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['student', 'mentor', 'administrator'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(name, email, password, confirmPassword, role);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      setError(error.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-blob signup-blob-tr" />
      <div className="signup-blob signup-blob-bl" />
      <div className="signup-content">
        <div className="signup-card">
          <h2 className="signup-title">Sign Up</h2>
          {error && (
            <div className="signup-error">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-field">
              <label htmlFor="name" className="signup-label">Name</label>
              <input
                type="text"
                className="signup-input"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="email" className="signup-label">Email address</label>
              <input
                type="email"
                className="signup-input"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="password" className="signup-label">Password</label>
              <input
                type="password"
                className="signup-input"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
              <input
                type="password"
                className="signup-input"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="signup-field">
              <label htmlFor="role" className="signup-label">Role</label>
              <select
                className="signup-select"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>
            <button type="submit" className="signup-btn">Sign Up</button>
          </form>
          <p className="signup-footer">
            Already have an account? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
