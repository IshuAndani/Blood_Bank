import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import BGSelect from '../components/BGSelect';
import CITYSelect from '../components/CITYSelect';
import DOBInput from '../components/DOBInput';

function DonorRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    city: '',
    dob: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword, bloodGroup, city, dob } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formattedDOB = new Date(dob);

    try {
      const res = await api.post('/donor/register', {
        name, email, password, bloodGroup, city, dob: formattedDOB
      });

      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => navigate('/donor/login'), 2000);
      } else {
        setError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-2xl font-semibold text-red-500 text-center mb-4">Donor Registration</h3>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 mb-3 rounded">{success}</div>}

        <form onSubmit={handleSubmit} className="">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            minLength="6"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            required
            onChange={handleChange}
          />

          <CITYSelect handleChange={handleChange} />
          <BGSelect handleChange={handleChange} />
          <DOBInput handleChange={handleChange} />

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="flex justify-between mt-4">
          <button
            className="w-1/2 mr-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded transition duration-200"
            onClick={() => navigate('/admin/login')}
          >
            Admin Login
          </button>
          <button
            className="w-1/2 ml-2 bg-blue-100 hover:bg-blue-200 text-green-500 py-2 rounded transition duration-200"
            onClick={() => navigate('/donor/login')}
          >
            Donor Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorRegister;
