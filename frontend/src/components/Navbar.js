import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const workplaceType = localStorage.getItem("workplaceType");

  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const renderRoleLinks = () => {
    switch (role) {
      case "superadmin":
        return (
          <>
            <NavbarLink to="/create/bloodbank" label="New BloodBank" />
            <NavbarLink to="/create/hospital" label="New Hospital" />
            <NavbarLink to="/superadmin/bloodbanks" label="BloodBanks" />
            <NavbarLink to="/superadmin/hospitals" label="Hospitals" />
            <NavbarLink to="/superadmin/donors" label="Donors" />
          </>
        );
      case "headadmin":
        return (
          <>
            <NavbarLink to="/blood-requests" label="Blood Requests" />
            <NavbarLink to="/admin/register" label="New Admin" />
            {workplaceType === "BloodBank" && (
              <NavbarLink to="/searchDonor" label="New Donation" />
            )}
          </>
        );
      case "admin":
        return (
          <>
            <NavbarLink to="/blood-requests" label="Blood Requests" />
            {workplaceType === "BloodBank" && (
              <NavbarLink to="/searchDonor" label="New Donation" />
            )}
          </>
        );
      case "donor":
        return <NavbarLink to="/chatbot" label="Chat" />;
      default:
        return null;
    }
  };

  return (
    <nav className="bg-primary text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl text-white font-bold">
          Blood Bank
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
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

        {/* Menu Links */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full lg:flex lg:items-center lg:w-auto`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6 mt-4 lg:mt-0">
            {renderRoleLinks()}

            {!token ? (
              <>
                <NavbarLink to="/donor/register" label="Register" />
                <NavbarLink to="/donor/login" label="Login" />
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
};

/**
 * Reusable Link component for nav items
 */
const NavbarLink = ({ to, label }) => (
  <li>
    <Link to={to} className="block py-1 lg:py-0 hover:underline">
      {label}
    </Link>
  </li>
);

export default Navbar;
