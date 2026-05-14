import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/api';
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
      authLogin(token, user);

      if (user && user.role === 'administrator') {
        window.location.href = '/admin/dashboard';
      } else if (user && user.role === 'mentor') {
        window.location.href = '/mentor-dashboard';
      } else if (user && user.role === 'student') {
        window.location.href = '/dashboard/jobs';
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
