import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const workplaceType = localStorage.getItem("workplaceType");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Blood Bank
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {(role === "donor") && (
              <>
                <li className="nav-item">
                  <Link to="/chatbot" className="nav-link">
                    Chat
                  </Link>  
                </li>
              </>
            )}

            {(role === "superadmin" && (
              <>
                <li className="nav-item">
                  <Link to="/create/bloodbank" className="nav-link">
                    New BloodBank
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/create/hospital" className="nav-link">
                    New Hospital
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/superadmin/bloodbanks" className="nav-link">
                    BloodBanks
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/superadmin/hospitals" className="nav-link">
                    Hospitals
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/superadmin/donors" className="nav-link">
                    Donors
                  </Link>
                </li>
              </>
            ))}

            {(role === "admin" || role === "headadmin") && (
              <>
                <li className="nav-item">
                  <Link to="/blood-requests" className="nav-link">
                    Blood Requests
                  </Link>
                </li>

                {workplaceType === "BloodBank" && (
                  <li className="nav-item">
                    <Link to="/searchDonor" className="nav-link">
                      New Donation
                    </Link>
                  </li>
                )}
              </>
            )}

            {(role === "headadmin") && (
              <>
                <li className="nav-item">
                  <Link to="/admin/register" className="nav-link">
                    New Admin
                  </Link>  
                </li>
              </>
              
            )}

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/donor/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/donor/login">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-sm btn-light ms-2" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
