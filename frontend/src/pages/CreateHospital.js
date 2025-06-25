import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CITYSelect from "../components/CITYSelect";
import { createHospital } from "../services/hospitalApiService";

const CreateHospital = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    coordinates: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("createHospitalForm");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
    if (locationState?.lat && locationState?.lng) {
      setFormData((prev) => ({
        ...prev,
        coordinates: {
          lat: locationState.lat,
          lng: locationState.lng,
        },
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectLocation = () => {
    if (!formData.city) {
      alert("Please select a city first!");
      return;
    }
    localStorage.setItem("createHospitalForm", JSON.stringify(formData));
    navigate("/select-location", {
      state: { city: formData.city, place: "hospital" },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("createHospitalForm");
    try {
      const res = await createHospital(formData);
      if (res.data.success) alert("Hospital Created Successfully");
      else alert("Error Creating Hospital: " + res.data.message);
    } catch (err) {
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Create Hospital</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Hospital Name
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <CITYSelect value={formData.city} handleChange={handleChange} />
        </div>

        <div>
          <button
            type="button"
            onClick={handleSelectLocation}
            className="w-full  px-4 py-2 rounded bg-red-500 text-white transition"
          >
            {formData.coordinates ? "Change Location on Map" : "Select Location on Map"}
          </button>
        </div>

        {formData.coordinates && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p className="text-sm">
              <strong>Selected Location:</strong><br />
              Latitude: {formData.coordinates.lat} <br />
              Longitude: {formData.coordinates.lng}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Create Hospital
        </button>
      </form>
    </div>
  );
};

export default CreateHospital;
