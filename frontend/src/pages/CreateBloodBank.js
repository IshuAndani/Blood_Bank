import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CITYSelect from '../components/CITYSelect';
import { createBloodBank } from '../services/bloodbankApiService';

const CreateBloodBank = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    coordinates: null
  });

  // Update coordinates if selected from map
  React.useEffect(() => {
    const saved = localStorage.getItem('createBloodBankForm');
    console.log(saved);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    if (locationState?.lat && locationState?.lng) {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          lat: locationState.lat,
          lng: locationState.lng
        }
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectLocation = () => {
    if (!formData.city) {
      alert('Please select a city first!');
      return;
    }
    localStorage.setItem('createBloodBankForm', JSON.stringify(formData));
    navigate('/select-location', { state: { city: formData.city , place : "bloodbank" } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem('createBloodBankForm');
    console.log('Submitting:', formData);
    try{
        const res = await createBloodBank(formData);
        if(res.data.success) alert("BloodBank Created Successfully");
        else alert("Error Creating BloodBank : ", res.data.message);
    }catch(err){
        alert("Server Error");
    }

    // TODO: Call your backend API to create the blood bank
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4 text-center">Create Blood Bank</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Blood Bank Name:</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <CITYSelect value={formData.city} handleChange={handleChange} />
        </div>

        <div className="mb-3">
          <button type="button" className="btn btn-outline-primary" onClick={handleSelectLocation}>
            {formData.coordinates ? 'Change Location on Map' : 'Select Location on Map'}
          </button>
        </div>

        {formData.coordinates && (
          <div className="alert alert-info">
            Selected Location: <br />
            Latitude: {formData.coordinates.lat} <br />
            Longitude: {formData.coordinates.lng}
          </div>
        )}

        <button type="submit" className="btn btn-success w-100">
          Create Blood Bank
        </button>
      </form>
    </div>
  );
};

export default CreateBloodBank;
