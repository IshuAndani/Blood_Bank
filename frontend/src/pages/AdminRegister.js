import React, { useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';
import api from '../api';

const RegisterEmployee = () => {
  const role = localStorage.getItem('role');
  let workplaceType = localStorage.getItem('workplaceType');
  let workplaceId = localStorage.getItem('workplaceId');
  const location = useLocation();
  
  if(role === 'superadmin') {
    workplaceId = location.state.workplaceId;
    workplaceType = location.state.workplaceType
  }

  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      workplaceType,
      workplaceId
    };

    try {
      const res = await api.post('/admin/register', payload);

      if (res.data.success) {
        setMessage(res.data.message);
        setFormData({ name: '', email: '' });
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">Register Employee</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
            disabled={loading}
          />
        </div>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
