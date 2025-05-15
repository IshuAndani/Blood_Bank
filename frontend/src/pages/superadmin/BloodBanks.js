import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBloodBanks } from '../../services/bloodbankApiService';

const BloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await getBloodBanks();
        setBloodBanks(res.data.data || []);
      } catch (err) {
        alert('Failed to fetch blood banks');
      }
    };
    fetchBloodBanks();
  }, []);

  const handleViewDetails = (bloodBank) => {
    navigate(`/superadmin/bloodbanks/${bloodBank._id}`, { state: bloodBank });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">All Blood Banks</h3>
      <div className="row">
        {bloodBanks.map((bb) => (
          <div className="col-md-4 mb-4" key={bb._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{bb.name}</h5>
                <p className="card-text">City: {bb.city}</p>
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => handleViewDetails(bb)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
        {bloodBanks.length === 0 && <p className="text-center">No blood banks found.</p>}
      </div>
    </div>
  );
};

export default BloodBanks;
