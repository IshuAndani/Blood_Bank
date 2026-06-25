import React, { useEffect, useState } from "react";
import { getDonors } from "../../services/donorApiService";

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await getDonors();
        setDonors(res.data.data || []);
      } catch (err) {
        alert("Failed to fetch donors");
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">All Donors</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading donors...</p>
      ) : donors.length === 0 ? (
        <p className="text-center text-gray-500">No donors found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-6"
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">
                {donor.name}
              </h3>
              <p className="text-sm text-gray-700">City: {donor.city}</p>
              <p className="text-sm text-gray-700">
                DOB: {new Date(donor.dob).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">Blood Group: {donor.bloodGroup}</p>
              <p className="text-sm text-gray-700">
                Donations: {donor.donations?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Donors;
