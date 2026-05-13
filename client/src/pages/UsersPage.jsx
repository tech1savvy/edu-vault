import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';

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
    } catch {
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
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center pt-12 bg-gray-900 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 pt-4 bg-gray-900 min-h-screen">
        <div className="px-4 py-3 rounded-lg bg-red-900/50 text-red-300 border border-red-800" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 bg-gray-900 text-gray-100 min-h-screen">
      <header className="mb-4">
        <h1 className="text-gray-100 text-2xl font-bold">Student Management</h1>
        <p className="text-gray-400">View and manage student accounts</p>
      </header>

      <div className="rounded-lg bg-gray-800 text-gray-100 shadow-lg">
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-gray-400 font-medium text-sm uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-sm uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-sm uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-sm uppercase tracking-wider">Last Login</th>
                  <th className="px-4 py-3 text-gray-400 font-medium text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-100 align-middle">{user.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-300 align-middle">{user.email}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusBadgeClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 align-middle">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded transition-all duration-300"
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
              <ul className="flex items-center justify-center gap-1">
                <li>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      pagination.page === 1
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <li key={i + 1}>
                    <button
                      type="button"
                      className={`px-3 py-2 rounded text-sm transition-colors ${
                        pagination.page === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      pagination.page === pagination.totalPages
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}

          <div className="text-center text-gray-400 mt-2 text-sm">
            Showing {users.length} of {pagination.total} students
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
