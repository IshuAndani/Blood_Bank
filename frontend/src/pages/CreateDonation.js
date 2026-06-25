import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDonorCleanup from '../hooks/useDonorCleanup';
import api from '../api';

const CreateDonation = () => {
  useDonorCleanup();
  const [donor, setDonor] = useState(null);
  const [eligible, setEligible] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonor = async () => {
      const donorEmail = localStorage.getItem("donorEmail");
      if (!donorEmail) return;

      try {
        const res = await api.get(`/donor/search?email=${donorEmail}`);
        const donorData = res.data.data;
        setDonor(donorData);

        // Age and donation gap logic
        const today = new Date();
        const dob = new Date(donorData.dob);
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (age < 18 || (age === 18 && monthDiff < 0) || age > 65 || (age === 65 && monthDiff > 0)) {
          setMessage('Donor must be between 18 and 65 years old.');
          return;
        }

        if (donorData.lastDonationDate) {
          const last = new Date(donorData.lastDonationDate);
          const daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24));
          if (daysSince < 56) {
            setMessage(`Minimum gap between donations is 56 days. Last donation was ${daysSince} days ago.`);
            return;
          }
        }

        setEligible(true);
        setMessage('✅ Donor is eligible to donate.');
      } catch (error) {
        setMessage('Error loading donor data.');
      }
    };

    fetchDonor();
  }, []);

  const createDonation = async () => {
    const res = await api.post('/donation/create', { donorId: donor.donorId });
    if (res.data.success) {
      alert('Donation created successfully!');
      navigate('/');
    } else {
      setMessage('❌ Failed to create donation.');
    }
  };

  if (!donor) return <div className="container mt-4">Loading donor data...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-3">💉 Create Donation</h2>

      <div className="card p-3">
        <h5>Donor Info</h5>
        <p><strong>Name:</strong> {donor.name}</p>
        <p><strong>Email:</strong> {donor.email}</p>
        <p><strong>Age:</strong> {new Date().getFullYear() - new Date(donor.dob).getFullYear()}</p>
        <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
        <p><strong>Total Donations:</strong> {donor.count}</p>
      </div>

      <div className="mt-3">
        <h5>Previous Donations</h5>
        {donor.donations.length > 0 ? (
          <ul className="list-group">
            {donor.donations.map((d, i) => (
              <li key={i} className="list-group-item">
                {d.name} - {d.city} - {new Date(d.date).toDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous donations.</p>
        )}
      </div>

      <div className="mt-4">
        <div className={`alert ${eligible ? 'alert-success' : 'alert-warning'}`}>
          {message}
        </div>
        {eligible && (
          <button className="btn btn-primary" onClick={createDonation}>Confirm Donation</button>
        )}
      </div>
    </div>
  );
};

export default CreateDonation;
