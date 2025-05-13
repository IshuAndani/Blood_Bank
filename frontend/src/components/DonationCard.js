import React from "react";

const DonationCard = ({ donation, role }) => {
  const formattedDate = new Date(donation.date).toLocaleDateString();

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        {role === "donor" ? (
          <>
            <h5 className="card-title">{donation.BloodBank?.name || "Blood Bank"}</h5>
            <p className="card-text">
              City: {donation.BloodBank?.city || "N/A"}
              <br />
              Date: {formattedDate}
            </p>
          </>
        ) : (
          <>
            <h5 className="card-title">{donation.donor?.name || "Donor"}</h5>
            <p className="card-text">
              Email: {donation.donor?.email || "N/A"}
              <br />
              Blood Group: {donation.donor?.bloodGroup || "N/A"}
              <br />
              Date: {formattedDate}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
