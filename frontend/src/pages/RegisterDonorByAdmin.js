import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import BGSelect from '../components/BGSelect';
import CITYSelect from '../components/CITYSelect';
import DOBInput from '../components/DOBInput';

const RegisterDonorByAdmin = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const email = new URLSearchParams(search).get('email');

  const [form, setForm] = useState({ name: '', bloodGroup: '', city: '', dob: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/donor/create', { ...form, email });
      if (res.data.success) {
        localStorage.setItem('donorEmail', res.data.data.email);
        navigate('/donation/create');
      } else {
        setError('Donor registration failed.');
      }
    } catch (err) {
      setError('Server error while registering donor.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧾 Register New Donor</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label>Email</label>
          <input className="form-control" value={email} disabled />
        </div>

        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
        </div>

        <BGSelect handleChange={handleChange} />
        <CITYSelect handleChange={handleChange} />
        <DOBInput handleChange={handleChange} />

        <button type="submit" className="btn btn-success mt-3">Register & Continue</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterDonorByAdmin;
