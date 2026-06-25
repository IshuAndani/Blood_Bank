import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBloodBanks } from "../../services/bloodbankApiService";

const BloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const res = await getBloodBanks();
        setBloodBanks(res.data.data || []);
      } catch (err) {
        alert("Failed to fetch blood banks");
      } finally {
        setLoading(false);
      }
    };
    fetchBloodBanks();
  }, []);

  const handleViewDetails = (bloodBank) => {
    navigate(`/superadmin/bloodbanks/${bloodBank._id}`, { state: bloodBank });
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">All Blood Banks</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading blood banks...</div>
      ) : bloodBanks.length === 0 ? (
        <p className="text-center text-gray-500">No blood banks found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bloodBanks.map((bb) => (
            <div
              key={bb._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-red-600">{bb.name}</h3>
                <p className="text-gray-600 mt-1">City: {bb.city}</p>
              </div>
              <button
                onClick={() => handleViewDetails(bb)}
                className="mt-4 w-fit bg-red-600 text-white px-4 py-2 rounded hover:bg-primary/90 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBanks;
