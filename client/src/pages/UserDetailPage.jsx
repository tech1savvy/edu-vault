import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi, adminService } from '../services/adminApi';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await adminApi.get(`/users/${id}`);
        setUser(response.data);
      } catch {
        setError('Failed to load user.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await adminService.updateUserStatus(id, newStatus);
      setUser({ ...user, status: newStatus });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const canModifyUser = () => {
    if (!user) return false;
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'student' && user.id !== currentUser.id;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500 text-gray-900';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeClass = (role) => {
    return role === 'administrator' ? 'bg-blue-600' : 'bg-gray-500';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-12 bg-gray-900 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="w-full px-4 pt-4 bg-gray-900 min-h-screen">
        <div className="px-4 py-3 rounded-lg bg-red-900/50 text-red-300 border border-red-800 mb-4" role="alert">
          {error || 'User not found'}
        </div>
        <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300" onClick={() => navigate('/admin/users')}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <button
        type="button"
        className="text-blue-400 hover:text-blue-300 no-underline mb-3 p-0 inline-flex items-center transition-colors"
        onClick={() => navigate('/admin/users')}
      >
        &larr; Back to Users
      </button>

      <div className="rounded-lg bg-gray-800 text-gray-100 shadow-lg mb-4">
        <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700 rounded-t-lg">
          <h4 className="mb-0 text-gray-100 font-semibold text-lg">User Profile</h4>
        </div>
        <div className="p-4 text-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-gray-100">
                <dt className="text-gray-400 font-medium">Name</dt>
                <dd className="text-gray-100">{user.name || 'N/A'}</dd>

                <dt className="text-gray-400 font-medium">Email</dt>
                <dd className="text-gray-100">{user.email}</dd>

                <dt className="text-gray-400 font-medium">Role</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </dd>

                <dt className="text-gray-400 font-medium">Status</dt>
                <dd>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusBadgeClass(user.status)}`}>
                    {user.status}
                  </span>
                </dd>

                <dt className="text-gray-400 font-medium">Last Login</dt>
                <dd className="text-gray-100">{formatDate(user.lastLogin)}</dd>

                <dt className="text-gray-400 font-medium">Created</dt>
                <dd className="text-gray-100">{formatDate(user.createdAt)}</dd>
              </dl>
            </div>

            <div>
              {canModifyUser() ? (
                <div className="rounded-lg bg-gray-900 border border-gray-700 text-gray-100">
                  <div className="p-4">
                    <h6 className="text-gray-100 font-semibold mb-1">Quick Actions</h6>
                    <p className="text-gray-400 text-sm mb-2">Change user status</p>
                    <div className="flex rounded-md overflow-hidden">
                      <button
                        type="button"
                        className={`flex-1 px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                          user.status === 'active'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-r border-gray-600'
                        }`}
                        onClick={() => handleStatusChange('active')}
                        disabled={updating || user.status === 'active'}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        className={`flex-1 px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                          user.status === 'inactive'
                            ? 'bg-yellow-500 text-gray-900'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-r border-gray-600'
                        }`}
                        onClick={() => handleStatusChange('inactive')}
                        disabled={updating || user.status === 'inactive'}
                      >
                        Inactive
                      </button>
                      <button
                        type="button"
                        className={`flex-1 px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                          user.status === 'suspended'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => handleStatusChange('suspended')}
                        disabled={updating || user.status === 'suspended'}
                      >
                        Suspended
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-lg bg-gray-700 text-gray-300">
                  {user.role === 'administrator'
                    ? 'Administrator accounts cannot be modified.'
                    : 'You cannot modify your own account.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-gray-800 text-gray-100 shadow-lg">
        <div className="px-4 py-3 bg-gray-900/50 border-b border-gray-700 rounded-t-lg">
          <h4 className="mb-0 text-gray-100 font-semibold text-lg">Resume Summary</h4>
          <p className="text-gray-400 text-sm mb-0">Profile data from resume builder</p>
        </div>
        <div className="p-4 text-gray-100">
          <p className="text-gray-300">
            Full resume view will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
