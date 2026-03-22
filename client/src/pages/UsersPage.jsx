import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';
import './UsersPage.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminService.getUsers(page, 20);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
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

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  };

  const currentUserId = getCurrentUserId();

  if (loading && users.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="users-page container-fluid py-4">
      <header className="mb-4">
        <h1>User Management</h1>
        <p className="text-muted">View and manage user accounts</p>
      </header>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name || 'N/A'}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleViewUser(user.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <nav className="mt-4" aria-label="User pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

          <div className="text-center text-muted mt-2">
            Showing {users.length} of {pagination.total} users
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
