import { useState } from "react";
import api from "../api";
import BGSelect from "../components/BGSelect";
import { BLOOD_GROUP_MAP } from "../constants/bloodGroups";

const BloodBank = function () {
    const [bloodGroup, setBloodGroup] = useState('');
    const [showBloodBanks, setShowBloodBanks] = useState(false);
    const [bloodBanks, setBloodBanks] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestedBanks, setRequestedBanks] = useState([]);

    const handleChange = (e) => {
        setBloodGroup(e.target.value);
    };

    const getBloodGroupKey = (value) => {
        return Object.keys(BLOOD_GROUP_MAP).find(
            key => BLOOD_GROUP_MAP[key] === value
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowBloodBanks(false);
        setBloodBanks([]);
        setMessage('');
        setLoading(true);

        try {
            let key = getBloodGroupKey(bloodGroup);
            const res = await api.get(`/bloodbank/search?bloodGroup=${key}`);
            if (res.data.success) {
                setShowBloodBanks(true);
                setBloodBanks(res.data.data);
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage('Server Error');
        } finally {
            setLoading(false);
        }
    };

    const handleRequest = async (BloodBankId) => {
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('bloodrequest/create', { bloodGroup, BloodBankId });
            if (res.data.success) {
                setMessage('Request sent successfully');
                setRequestedBanks(prev => [...prev, BloodBankId]);
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage('Server Error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Create Blood Request for a Blood Group</h2>

            <form onSubmit={handleSubmit} className="mb-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <BGSelect handleChange={handleChange} />
                    </div>
                    <div className="col-md-6 d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                "Search BloodBanks"
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {message && (
                <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`} role="alert">
                    {message}
                </div>
            )}

            {showBloodBanks && (
                !bloodBanks || bloodBanks.length === 0 ? (
                    <div className="alert alert-info text-center">No BloodBanks have the required blood type!</div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {bloodBanks.map((bloodBank, idx) => (
                            <div key={idx} className="col">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <h5 className="card-title">{bloodBank.name}</h5>
                                        <p className="card-text"><strong>City:</strong> {bloodBank.city}</p>
                                        <p className="card-text"><strong>Available Units:</strong> {bloodBank.availableUnits}</p>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleRequest(bloodBank.id)}
                                            disabled={requestedBanks.includes(bloodBank._id) || loading}
                                        >
                                            {requestedBanks.includes(bloodBank._id) ? 'Requested' : 'Send Request'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default BloodBank;
