import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import Card from '../components/ui/Card';
import FormInput from '../components/ui/FormInput';
import { AuthContext } from '../context/AuthContext';
import { ResumeContext } from '../context/resumeContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);
  const { refreshResume } = useContext(ResumeContext);
  const passwordStrength =
    password.length >= 10 ? 'Strong' : password.length >= 7 ? 'Medium' : password.length > 0 ? 'Weak' : 'None';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const { token, user } = await signup(name, email, password);
      authLogin(token, user);
      if (user?.role === 'student') {
        await refreshResume(token);
      }
      navigate(user?.role === 'administrator' ? '/admin/dashboard' : '/dashboard/profile');
    } catch (error) {
      console.error('Signup failed:', error);
      setError(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          'Signup failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <Card title="Create your EduVault account" subtitle="Secure your account and start building your profile.">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <FormInput label="Name" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FormInput label="Email address" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <FormInput label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                Password strength: <span className="font-semibold">{passwordStrength}</span>
              </p>
            </div>
            {error && (
              <p className="md:col-span-2 rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 dark:ring-1 dark:ring-rose-800/80">
                {error}
              </p>
            )}
            <div className="md:col-span-2">
              <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-slate-700 dark:text-slate-300">
            Already have an account?{" "}
            <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400" to="/login">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
