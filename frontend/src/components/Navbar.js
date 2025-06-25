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
        return [
          { to: "/create/bloodbank", label: "New BloodBank" },
          { to: "/create/hospital", label: "New Hospital" },
          { to: "/superadmin/bloodbanks", label: "BloodBanks" },
          { to: "/superadmin/hospitals", label: "Hospitals" },
          { to: "/superadmin/donors", label: "Donors" },
        ];
      case "headadmin":
        return [
          { to: "/blood-requests", label: "Blood Requests" },
          { to: "/admin/register", label: "New Admin" },
          ...(workplaceType === "BloodBank"
            ? [{ to: "/searchDonor", label: "New Donation" }]
            : []),
        ];
      case "admin":
        return [
          { to: "/blood-requests", label: "Blood Requests" },
          ...(workplaceType === "BloodBank"
            ? [{ to: "/searchDonor", label: "New Donation" }]
            : []),
        ];
      case "donor":
        return [{ to: "/chatbot", label: "Chat" }];
      default:
        return [];
    }
  };

  const navLinks = renderRoleLinks();

  return (
    <nav className="bg-red-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-white">
          Blood Bank
        </Link>

        <button
          className="lg:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label="Toggle menu"
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

        {/* Desktop menu */}
        <ul className="hidden lg:flex  items-center space-x-6" style={{
          textDecoration: 'none'
        }}>
          {navLinks.map((link) => (
            <NavbarLink key={link.to} to={link.to} label={link.label} />
          ))}

          {!token ? (
            <>
              <NavbarLink to="/donor/register" label="Register" />
              <NavbarLink to="/donor/login" label="Login" />
            </>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-1 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-red-500 px-4 pb-4">
          <ul className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavbarLink key={link.to} to={link.to} label={link.label} onClick={() => setIsOpen(false)} />
            ))}

            {!token ? (
              <>
                <NavbarLink to="/donor/register" label="Register" onClick={() => setIsOpen(false)} />
                <NavbarLink to="/donor/login" label="Login" onClick={() => setIsOpen(false)} />
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

const NavbarLink = ({ to, label, onClick }) => (
  <li>
    <Link
      to={to}
      onClick={onClick}
      className="block text-white  transition"
    >
      {label}
    </Link>
  </li>
);

export default Navbar;
