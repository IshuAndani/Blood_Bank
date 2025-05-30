import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const workplaceType = localStorage.getItem("workplaceType");

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold">
          Blood Bank
        </Link>
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.3 5.71a1 1 0 010 1.42L13.42 12l4.88 4.88a1 1 0 11-1.42 1.42L12 13.42l-4.88 4.88a1 1 0 01-1.42-1.42L10.58 12 5.7 7.12a1 1 0 011.42-1.42L12 10.58l4.88-4.88a1 1 0 011.42 0z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
              />
            )}
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full lg:flex lg:items-center lg:w-auto`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0">
            {(role === "donor") && (
              <li>
                <Link to="/chatbot" className="block py-2 lg:py-0 hover:underline">
                  Chat
                </Link>
              </li>
            )}

            {role === "superadmin" && (
              <>
                <li>
                  <Link to="/create/bloodbank" className="block py-2 lg:py-0 hover:underline">
                    New BloodBank
                  </Link>
                </li>
                <li>
                  <Link to="/create/hospital" className="block py-2 lg:py-0 hover:underline">
                    New Hospital
                  </Link>
                </li>
                <li>
                  <Link to="/superadmin/bloodbanks" className="block py-2 lg:py-0 hover:underline">
                    BloodBanks
                  </Link>
                </li>
                <li>
                  <Link to="/superadmin/hospitals" className="block py-2 lg:py-0 hover:underline">
                    Hospitals
                  </Link>
                </li>
                <li>
                  <Link to="/superadmin/donors" className="block py-2 lg:py-0 hover:underline">
                    Donors
                  </Link>
                </li>
              </>
            )}

            {(role === "admin" || role === "headadmin") && (
              <>
                <li>
                  <Link to="/blood-requests" className="block py-2 lg:py-0 hover:underline">
                    Blood Requests
                  </Link>
                </li>
                {workplaceType === "BloodBank" && (
                  <li>
                    <Link to="/searchDonor" className="block py-2 lg:py-0 hover:underline">
                      New Donation
                    </Link>
                  </li>
                )}
              </>
            )}

            {role === "headadmin" && (
              <li>
                <Link to="/admin/register" className="block py-2 lg:py-0 hover:underline">
                  New Admin
                </Link>
              </li>
            )}

            {!token ? (
              <>
                <li>
                  <Link to="/donor/register" className="block py-2 lg:py-0 hover:underline">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/donor/login" className="block py-2 lg:py-0 hover:underline">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-white text-primary rounded px-3 py-1 mt-2 lg:mt-0 hover:bg-gray-100"
                >
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
