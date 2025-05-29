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
      const res = await api.post('/api/v1/admin/login', { email, password });

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
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">Admin Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 mb-4 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-6 gap-2">
          <button
            onClick={() => navigate('/donor/login')}
            className="w-1/2 bg-blue-100 text-blue-600 py-2 rounded-md hover:bg-blue-200 transition"
          >
            Donor Login
          </button>
          <button
            onClick={() => navigate('/donor/register')}
            className="w-1/2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Donor Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
