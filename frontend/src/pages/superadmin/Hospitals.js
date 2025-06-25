import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHospitals } from "../../services/hospitalApiService";

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await getHospitals();
        setHospitals(res.data.data || []);
      } catch (err) {
        alert("Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  const createHeadAdmin = (hospital) => {
    navigate("/admin/register", {
      state: { workplaceType: "Hospital", workplaceId: hospital._id },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">All Hospitals</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading hospitals...</p>
      ) : hospitals.length === 0 ? (
        <p className="text-center text-gray-500">No hospitals found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((h) => (
            <div
              key={h._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg uppercase font-bold text-red-500">{h.name}</h3>
                <p className="text-gray-600 mt-1">City: {h.city}</p>
              </div>
              <button
                onClick={() => createHeadAdmin(h)}
                className="mt-4 w-fit bg-red-500 text-white px-4 py-2 rounded hover:bg-primary/90 transition"
              >
                Create Headadmin
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hospitals;
