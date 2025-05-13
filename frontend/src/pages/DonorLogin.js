import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
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
      const res = await api.post('/donor/login', { email, password });
      if (res.data.success) {
        setSuccess(res.data.message);
        localStorage.clear();
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('id', res.data.data.donorId);
        localStorage.setItem('role', 'donor');
        localStorage.setItem('name', res.data.data.name);
        localStorage.setItem('lastDonationDate', res.data.data.lastDonationDate);

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
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Donor Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>

          {error && <div className="alert alert-danger py-1 my-2">{error}</div>}
          {success && <div className="alert alert-success py-1 my-2">{success}</div>}
        </form>

        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-outline-secondary w-48" onClick={() => navigate('/admin/login')}>
            Admin Login
          </button>
          <button className="btn btn-outline-success w-48" onClick={() => navigate('/donor/register')}>
            Donor Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
