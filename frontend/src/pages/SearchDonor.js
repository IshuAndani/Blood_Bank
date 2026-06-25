import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const SearchDonor = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.get(`/donor/search?email=${email}`);
      if (res.data.success) {
        localStorage.setItem("donorEmail", res.data.data.email);
        navigate("/donation/create");
      } else {
        navigate(`/createDonor?email=${email}`);
      }
    } catch (err) {
      console.error(err);
      setError("Server error while searching for donor.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">🔍 Search Donor</h2>
      <form onSubmit={handleSearch} className="space-y-5">
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Donor Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter donor email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded transition"
        >
          Search
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchDonor;
