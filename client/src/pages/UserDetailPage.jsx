import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import './UserDetailPage.css';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await adminService.getUserById(id);
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user details.');
    } finally {
      setLoading(false);
    }
  };

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
      case 'active': return 'bg-success';
      case 'inactive': return 'bg-warning';
      case 'suspended': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const getRoleBadgeClass = (role) => {
    return role === 'administrator' ? 'bg-primary' : 'bg-secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'User not found'}
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-page container-fluid py-4">
      <button
        type="button"
        className="btn btn-link text-decoration-none mb-3 p-0"
        onClick={() => navigate('/admin/users')}
      >
        &larr; Back to Users
      </button>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">User Profile</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <dl className="row mb-0">
                <dt className="col-sm-3">Name</dt>
                <dd className="col-sm-9">{user.name || 'N/A'}</dd>

                <dt className="col-sm-3">Email</dt>
                <dd className="col-sm-9">{user.email}</dd>

                <dt className="col-sm-3">Role</dt>
                <dd className="col-sm-9">
                  <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </dd>

                <dt className="col-sm-3">Status</dt>
                <dd className="col-sm-9">
                  <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                    {user.status}
                  </span>
                </dd>

                <dt className="col-sm-3">Last Login</dt>
                <dd className="col-sm-9">{formatDate(user.lastLogin)}</dd>

                <dt className="col-sm-3">Created</dt>
                <dd className="col-sm-9">{formatDate(user.createdAt)}</dd>
              </dl>
            </div>

            <div className="col-md-6">
              {canModifyUser() ? (
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title">Quick Actions</h6>
                    <p className="text-muted small mb-2">Change user status</p>
                    <div className="btn-group" role="group">
                      <button
                        type="button"
                        className={`btn btn-sm ${user.status === 'active' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => handleStatusChange('active')}
                        disabled={updating || user.status === 'active'}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${user.status === 'inactive' ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleStatusChange('inactive')}
                        disabled={updating || user.status === 'inactive'}
                      >
                        Inactive
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${user.status === 'suspended' ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => handleStatusChange('suspended')}
                        disabled={updating || user.status === 'suspended'}
                      >
                        Suspended
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-info mb-0">
                  {user.role === 'administrator'
                    ? 'Administrator accounts cannot be modified.'
                    : 'You cannot modify your own account.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h4 className="mb-0">Resume Summary</h4>
          <p className="text-muted small mb-0">Profile data from resume builder</p>
        </div>
        <div className="card-body">
          <p className="text-muted">
            Full resume view will be implemented in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
