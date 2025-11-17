import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';

const JobDescriptionFormPage = () => {
  const { id } = useParams(); // Get ID from URL for editing
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
          const response = await adminApi.getJobDescriptionById(id);
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

    // Basic validation
    if (!formData.title || !formData.description || !formData.requirements) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await adminApi.updateJobDescription(id, formData);
        alert('Job Description updated successfully!');
      } else {
        await adminApi.createJobDescription(formData);
        alert('Job Description created successfully!');
      }
      navigate('/admin/dashboard'); // Redirect to dashboard after success
    } catch (err) {
      setError('Failed to save job description.');
      console.error('Error saving job description:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="text-center mt-8">Loading job description...</div>;
  if (error) return <div className="text-center mt-8 text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{isEditing ? 'Edit Job Description' : 'Create New Job Description'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="requirements" className="form-label">Requirements</label>
          <textarea
            className="form-control"
            id="requirements"
            name="requirements"
            rows="5"
            value={formData.requirements}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : (isEditing ? 'Update Job Description' : 'Create Job Description')}
        </button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/admin/dashboard')}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default JobDescriptionFormPage;
