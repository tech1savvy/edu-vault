import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../services/adminApi';

const JobDescriptionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchJobDescription = async () => {
        setLoading(true);
        try {
          const response = await adminService.getJobDescriptionById(id);
          setFormData(response.data);
        } catch (err) {
          setError('Failed to fetch job description.');
          console.error('Error fetching job description:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchJobDescription();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.requirements) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await adminService.updateJobDescription(id, formData);
        alert('Job Description updated successfully!');
      } else {
        await adminService.createJobDescription(formData);
        alert('Job Description created successfully!');
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to save job description.');
      console.error('Error saving job description:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="text-center mt-8 text-gray-100">Loading job description...</div>;
  if (error) return <div className="text-center mt-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 px-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-100">{isEditing ? 'Edit Job Description' : 'Create New Job Description'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
          <input
            type="text"
            className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-300 mb-1">Requirements</label>
          <textarea
            className="w-full bg-gray-900 text-gray-100 border border-gray-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            id="requirements"
            name="requirements"
            rows="5"
            value={formData.requirements}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="theme-btn theme-btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Job Description' : 'Create Job Description')}
        </button>
        <button type="button" className="theme-btn border border-gray-500 text-gray-300 ml-2" onClick={() => navigate('/admin/dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default JobDescriptionFormPage;
