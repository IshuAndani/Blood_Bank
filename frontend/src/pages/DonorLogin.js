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
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-semibold text-red-500 text-center mb-4 text-gray-800">
          Donor Login
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border  text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
          >
            Login
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm border border-green-200">
              {success}
            </div>
          )}
        </form>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            className="flex-1 border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => navigate('/admin/login')}
          >
            Admin Login
          </button>
          <button
            className="flex-1 border border-green-400 text-green-700 py-2 rounded-lg hover:bg-green-50 transition"
            onClick={() => navigate('/donor/register')}
          >
            Donor Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
