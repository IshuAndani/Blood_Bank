import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getEmployees } from '../../services/bloodbankApiService';

const BloodBankEmployees = () => {
  const { state } = useLocation();
  const bloodBankId = state?.bloodBankId;
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bloodBankId) {
      setError('No blood bank selected.');
      setLoading(false);
      return;
    }
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees(bloodBankId);
        setEmployees(res.data.data || []);
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [bloodBankId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold text-center mb-2">Blood Bank Employees</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading employees...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500">No employees found.</p>
      ) : (
        <div className="grid gap-6">
          {employees.map((emp) => (
            <div
              key={emp._id}
              className="bg-white rounded-xl shadow hover:shadow-md transition-shadow duration-300 p-6"
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">
                {emp.name}
              </h3>
              <p className="text-sm text-gray-700">Email: {emp.email}</p>
              <p className="text-sm text-gray-700">Role: {emp.role} ({emp.type})</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBankEmployees; 