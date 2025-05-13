import { useEffect, useState } from "react";
import api from "../api";

function BloodRequest() {
  const [bloodRequests, setBloodRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const workplaceType = localStorage.getItem("workplaceType");
  const title =
    workplaceType === "BloodBank"
      ? "Blood Requests Received"
      : "Blood Requests Sent";

  useEffect(() => {
    const fetchBloodRequests = async () => {
      try {
        const res = await api.get("/bloodrequest");
        console.log(res);
        setBloodRequests(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch blood requests");
        setMessageType("error");
        setTimeout(() => setMessage(""), 3000);
      }
    };
    fetchBloodRequests();
  }, []);

  const updateStatus = async (id, status, idx) => {
    let reason;
    if (status === "rejected") {
      reason = window.prompt("Enter Rejection Reason");
    }

    try {
      const res = await api.patch(`/bloodrequest/${id}/status`, {
        status,
        reason,
      });

      if (res.data.success) {
        setBloodRequests((prev) =>
          prev.map((req, i) =>
            i === idx ? { ...req, status: status } : req
          )
        );
        setMessage("Status updated successfully");
        setMessageType("success");
      } else {
        setMessage(res.data.message || "Update failed");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server Error");
      setMessageType("error");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="container mt-4">
      {message && (
        <div
          className={`alert ${
            messageType === "success" ? "alert-success" : "alert-danger"
          } text-center`}
          role="alert"
        >
          {message}
        </div>
      )}

      <h3 className="mb-4">{title}</h3>
      {bloodRequests.length === 0 ? (
        <p>No blood requests found.</p>
      ) : (
        <div className="row">
          {bloodRequests.map((br, idx) => (
            <div className="col-md-6 col-lg-4 mb-4" key={br._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{br.name}</h5>
                  <p className="card-text">
                    City: {br.city}
                    <br />
                    Blood Group: {br.bloodGroup}
                    <br />
                    Date: {new Date(br.date).toLocaleDateString()}
                    <br />
                    Status:{" "}
                    <span
                      className={`badge ${
                        br.status === "approved"
                          ? "bg-success"
                          : br.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {br.status}
                    </span>
                  </p>

                  {/* Show buttons only if workplace is blood bank and status is pending */}
                  {workplaceType === "BloodBank" && br.status === "pending" && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => updateStatus(br.id, "approved", idx)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(br.id, "rejected", idx)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BloodRequest;
