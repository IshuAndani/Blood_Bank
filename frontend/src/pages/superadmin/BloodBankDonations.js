import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getBloodBankDonations } from '../../services/bloodbankApiService';

const BloodBankDonations = () => {
  const { state } = useLocation();
  const bloodBankId = state?.bloodBankId;
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bloodBankId) {
      setError('No blood bank selected.');
      setLoading(false);
      return;
    }
    const fetchDonations = async () => {
      try {
        const res = await getBloodBankDonations(bloodBankId);
        setDonations(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, [bloodBankId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-2">Blood Bank Donations</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading donations...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : donations.length === 0 ? (
        <p className="text-center text-gray-500">No donations found.</p>
      ) : (
        <div className="grid gap-6">
          {donations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-6"
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">
                Donor: {donation.donor?.name || 'Unknown'}
              </h3>
              <p className="text-sm text-gray-700">Email: {donation.donor?.email || 'N/A'}</p>
              <p className="text-sm text-gray-700">Blood Group: {donation.donor?.bloodGroup || 'N/A'}</p>
              <p className="text-sm text-gray-700">Units: {donation.units}</p>
              <p className="text-sm text-gray-700">Date: {new Date(donation.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBankDonations; 