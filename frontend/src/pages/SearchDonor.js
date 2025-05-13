import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SearchDonor = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.get(`/donor/search?email=${email}`);
      if (res.data.success) {
        localStorage.setItem('donorEmail', res.data.data.email);
        navigate('/donation/create');
      } else {
        navigate(`/createDonor?email=${email}`);
      }
    } catch (err) {
      console.error(err);
      setError('Server error while searching for donor.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-3">🔍 Search Donor</h2>
      <form onSubmit={handleSearch} className="w-50">
        <div className="mb-3">
          <label className="form-label">Donor Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter donor email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default SearchDonor;
