import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BloodBankDetails = () => {
  const { state: bloodBank } = useLocation();
  const navigate = useNavigate();

  if (!bloodBank) {
    return (
      <p className="text-center text-red-500 text-lg mt-10">
        Invalid access. No blood bank data found.
      </p>
    );
  }

  const handleNavigate = (path) => {
    navigate(`/bloodbanks/${bloodBank._id}/${path}`, {
      state: { bloodBankId: bloodBank._id },
    });
  };

  const handleRegisterHeadadmin = () => {
    navigate("/admin/register", {
      state: {
        workplaceType: "BloodBank",
        workplaceId: bloodBank._id,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-2">{bloodBank.name}</h2>
      <p className="text-center text-zinc-100 mb-6">City: {bloodBank.city}</p>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => handleNavigate("donations")}
          className="w-full sm:w-2/3 bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
        >
          View Donations
        </button>
        <button
          onClick={() => handleNavigate("employees")}
          className="w-full sm:w-2/3 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
        >
          View Employees
        </button>
        <button
          onClick={handleRegisterHeadadmin}
          className="w-full sm:w-2/3 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Create Headadmin
        </button>
      </div>
    </div>
  );
};

export default BloodBankDetails;
