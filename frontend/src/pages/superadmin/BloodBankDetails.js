import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BloodBankDetails = () => {
  const { state: bloodBank } = useLocation();
  const navigate = useNavigate();

  if (!bloodBank) return <p className="text-center mt-5">Invalid access. No blood bank data found.</p>;

  const handleNavigate = (path) => {
      navigate(`/bloodbanks/${bloodBank._id}/${path}`, { state: { bloodBankId: bloodBank._id } });
  };

  const handleRegisterHeadadmin = () => {
    navigate('/admin/register', {
      state: {
        workplaceType: 'BloodBank',
        workplaceId: bloodBank._id,
      },
    });
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">{bloodBank.name}</h3>
      <p className="text-center text-muted">City: {bloodBank.city}</p>

      <div className="d-flex flex-column align-items-center gap-3 mt-4">
        <button className="btn btn-primary w-50" onClick={() => handleNavigate('/donations')}>
          View Donations
        </button>
        <button className="btn btn-secondary w-50" onClick={() => handleNavigate('/employees')}>
          View Employees
        </button>
        <button className="btn btn-success w-50" onClick={handleRegisterHeadadmin}>
          Create Headadmin
        </button>
      </div>
    </div>
  );
};

export default BloodBankDetails;
