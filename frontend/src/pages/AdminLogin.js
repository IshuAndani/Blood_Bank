import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // axios instance

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/admin/login', { email, password });

      if (res.data.success) {
        setSuccess(res.data.message);
        localStorage.clear();
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('id', res.data.data.adminId);
        localStorage.setItem('role', res.data.data.role);

        if (res.data.role !== 'superadmin') {
          localStorage.setItem('workplaceId', res.data.data.workplaceId);
          localStorage.setItem('workplaceType', res.data.data.workplaceType);
        }

        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-3">Admin Login</h3>

        {error && <div className="alert alert-danger py-1">{error}</div>}
        {success && <div className="alert alert-success py-1">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit">Login</button>
        </form>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-outline-primary w-48" onClick={() => navigate('/donor/login')}>
            Donor Login
          </button>
          <button className="btn btn-outline-secondary w-48" onClick={() => navigate('/donor/register')}>
            Donor Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
