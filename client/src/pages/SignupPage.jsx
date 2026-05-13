import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="theme-bg flex items-center justify-center">
      <div className="theme-blob theme-blob-tr" />
      <div className="theme-blob theme-blob-bl" />
      <div className="theme-content w-full max-w-md mx-auto px-4 py-12">
        <div className="theme-card p-6">
          <h2 className="text-2xl font-bold text-center mb-6 theme-gradient-text inline-block w-full">Sign Up</h2>
          {error && (
            <div className="px-4 py-3 rounded-lg mb-4 bg-red-500/20 text-red-400 border border-red-500/30 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
              <input
                type="text"
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500 placeholder-gray-500"
                id="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-400 mb-1">Role</label>
              <select 
                className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-blue-500"
                id="role" 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="administrator">Administrator</option>
              </select>
            </div>
            <button type="submit" className="theme-btn theme-btn-primary w-full justify-center py-2.5">Sign Up</button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
