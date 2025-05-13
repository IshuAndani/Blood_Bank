import React, { useState, useEffect } from 'react';
import api from '../api';

const RegisterEmployee = () => {
  const role = localStorage.getItem('role');
  const workplaceType = localStorage.getItem('workplaceType');
  const workplaceId = localStorage.getItem('workplaceId');

  const [formData, setFormData] = useState({
    name: '', email: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      workplaceType,
      workplaceId
    };

    try {
      const res = await api.post('/admin/register', payload);

      if (res.data.success) {
        setMessage(res.data.message);
        setFormData({ name: '', email: '', password: '', role: '', workplace: '' });
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  if(role !== "headadmin") return null;

  return (
    <div className="container mt-4">
      <h3>Register Employee</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleRegister}>
        <div className="mb-2">
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-2">
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>
        <button className="btn btn-success mt-2" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
