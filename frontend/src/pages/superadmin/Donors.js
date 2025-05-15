import React, { useEffect, useState } from 'react';
import { getDonors } from '../../services/donorApiService'; 

const Donors = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await getDonors();
        setDonors(res.data.data || []);
      } catch (err) {
        alert('Failed to fetch donors');
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">All Donors</h3>
      <div className="row">
        {donors.map((donor) => (
          <div className="col-md-4 mb-4" key={donor._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{donor.name}</h5>
                <p className="card-text">City: {donor.city}</p>
                <p className="card-text">Date of Birth: {new Date(donor.dob).toLocaleDateString()}</p>
                <p className="card-text">Blood Group: {donor.bloodGroup}</p>
                <p className="card-text">No. of Donations: {donor.donations?.length || 0}</p>
              </div>
            </div>
          </div>
        ))}
        {donors.length === 0 && <p className="text-center">No donors found.</p>}
      </div>
    </div>
  );
};

export default Donors;
