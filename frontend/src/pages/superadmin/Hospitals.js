import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHospitals } from '../../services/hospitalApiService';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await getHospitals();
        setHospitals(res.data.data || []);
      } catch (err) {
        alert('Failed to fetch hospitals');
      }
    };
    fetchHospitals();
  }, []);

  const createHeadAdmin = (hospital) => {
    navigate(`/admin/register`, { state: {workplaceType : "Hospital", workplaceId : hospital._id} });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">All hospitals</h3>
      <div className="row">
        {hospitals.map((h) => (
          <div className="col-md-4 mb-4" key={h._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{h.name}</h5>
                <p className="card-text">City: {h.city}</p>
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => createHeadAdmin(h)}
                >
                  Create Headadmin
                </button>
              </div>
            </div>
          </div>
        ))}
        {hospitals.length === 0 && <p className="text-center">No hospitals found.</p>}
      </div>
    </div>
  );
};

export default Hospitals;
