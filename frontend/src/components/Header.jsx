import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react"; 

export default function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const NavLink = ({ label, path }) => (
    <button
      onClick={() => navigate(path)}
      className={`text-gray-700 hover:text-blue-600 transition ${
        location.pathname === path ? "font-semibold text-blue-700" : ""
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img
  src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
  alt="logo"
  className="w-8 h-8 object-contain" 
  style={{ maxWidth: "40px", maxHeight: "40px" }} 
/>

          <h1 className="text-xl font-bold text-blue-700">AI Research Reviewer</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink label="Home" path="/home" />
          <NavLink label="Profile" path="/profile" />
          <NavLink label="Uploads" path="/home" />
          <NavLink label="About" path="/about" />
        </nav>
        {user && (
          <div className="relative">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1.5 rounded-lg transition"
            >
              <img
  src="https://via.placeholder.com/35"
  alt="profile"
  className="w-8 h-8 rounded-full object-cover border border-gray-300"
  style={{ maxWidth: "35px", maxHeight: "35px" }} 
/>

              <span className="hidden sm:inline text-gray-700 font-medium">{user.username}</span>
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-sm flex flex-col space-y-2 px-6 py-3">
          <NavLink label="Home" path="/home" />
          <NavLink label="Profile" path="/profile" />
          <NavLink label="Uploads" path="/home" />
          <NavLink label="About" path="/about" />
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:underline mt-2 text-left"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
