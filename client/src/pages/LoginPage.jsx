import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginApi } from '../services/api';
import { ResumeContext } from '../context/resumeContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import FormInput from '../components/ui/FormInput';
import Skeleton from '../components/ui/Skeleton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { refreshResume } = useContext(ResumeContext);
  const { login: authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = 'Email is required';
    if (!password.trim()) nextErrors.password = 'Password is required';
    setErrors(nextErrors);
    setApiError('');
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const { token, user } = await loginApi(email, password); // Get user object from response
      
      // Update reactive auth state
      authLogin(token, user);

      if (user && user.role === 'student') {
        await refreshResume(token);
      }

      if (user && user.role === 'administrator') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard/profile');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setApiError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[78vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {loading ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Card title="Welcome back" subtitle="Login to continue building your profile.">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Email address"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <FormInput
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              {apiError && (
                <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-1 dark:ring-rose-800/80">
                  {apiError}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Link to="/contact" className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-400">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300">
              Don't have an account?{" "}
              <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400" to="/signup">
                Sign up
              </Link>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
