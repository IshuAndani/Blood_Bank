import { useEffect, useState } from "react";
import api from "../api";
import DonationCard from "../components/DonationCard";

const Donation = () => {
  const [donations, setDonations] = useState([]);
  const role = localStorage.getItem("role");
  const workplaceType = localStorage.getItem("workplaceType");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (workplaceType === "BloodBank") {
          res = await api.get("/donation");
        } else if (role === "donor") {
          res = await api.get("/donor/donations");
        }

        setDonations(res?.data?.data?.donations || []);
      } catch (err) {
        console.error(err);
        setDonations([]);
      }
    };

    fetchData();
  }, [role, workplaceType]);

  const getTitle = () => {
    if (workplaceType === "BloodBank") return "Donations Received";
    if (role === "donor") return "Your Donations";
    return "Donations";
  };

  return (
    <div className="container">
      <h3 className="mb-4">{getTitle()}</h3>
      <div className="row">
        {donations.length === 0 ? (
          <p>No donations found.</p>
        ) : (
          donations.map((donation, idx) => (
            <div className="col-md-6 col-lg-4 mb-4" key={idx}>
              <DonationCard donation={donation} role={role} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Donation;
