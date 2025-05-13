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
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '500px', width: '100%' }}>
        <h3 className="text-center mb-3">Donor Registration</h3>

        {error && <div className="alert alert-danger py-1">{error}</div>}
        {success && <div className="alert alert-success py-1">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input type="text" name="name" placeholder="Name" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input type="email" name="email" placeholder="Email" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input type="password" name="password" placeholder="Password" minLength="6" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-2">
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="form-control" required onChange={handleChange} />
          </div>
          <div className="mb-2">
            <CITYSelect handleChange={handleChange} />
          </div>
          <div className="mb-2">
            <BGSelect handleChange={handleChange} />
          </div>
          <div className="mb-2">
            <DOBInput handleChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">Register</button>
        </form>

        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-outline-secondary w-48" onClick={() => navigate('/admin/login')}>
            Admin Login
          </button>
          <button className="btn btn-outline-primary w-48" onClick={() => navigate('/donor/login')}>
            Donor Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default DonorRegister;
