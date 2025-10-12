import React, { useState } from 'react';
import './Navbar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const [menu, setMenu] = useState("home");
const [hamburgerOpen, setHamburgerOpen] = useState(false); // for categories
const [userDropdownOpen, setUserDropdownOpen] = useState(false); // for My Account

  
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const categories = [
    { name: "Home", path: "/" },
    { name: "AIRPODS", path: "/airpods" },
    { name: "CAMERA", path: "/camera" },
    { name: "EARPHONES", path: "/earphones" },
    { name: "MOBILE", path: "/mobile" },
    { name: "MOUSE", path: "/mouse" },
    { name: "PRINTERS", path: "/printers" },
    { name: "SPEAKERS", path: "/speakers" },
    { name: "REFRIGERATOR", path: "/refrigerator" },
    { name: "TV", path: "/tv" },
    { name: "WATCHES", path: "/watches" },
    { name: "TRIMMERS", path: "/trimmers" },
    { name: "PROCESSORS", path: "/processor" },
  ];

  return (
    <div className="navbar">
      <div className="nav-logo">
        <Link to="/" className="logo-text">Eloc</Link>
      </div>

      <ul className="nav-categories">
        {categories.map((cat) => (
          <li key={cat.name} onClick={() => setMenu(cat.name.toLowerCase())}>
            <Link to={cat.path} className={`nav-link ${menu === cat.name.toLowerCase() ? 'active' : ''}`}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>

     <div className="nav-actions">
  {isLoggedIn ? (
    <div className="user-dropdown">
      <button onClick={() => setUserDropdownOpen(!userDropdownOpen)} className="login-link">
        My Account ▾
      </button>
      {userDropdownOpen && (
        <div className="dropdown-menu-user">
          <Link to="/profile" onClick={() => setUserDropdownOpen(false)}>Profile</Link>
          <Link to="/orders" onClick={() => setUserDropdownOpen(false)}>Orders</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  ) : (
    <Link to="/login" className="login-link">Login</Link>
  )}

  <Link to="/cart">
    <FaShoppingCart className="cart-icon" />
  </Link>

  <div className="hamburger" onClick={() => setHamburgerOpen(!hamburgerOpen)}>☰</div>
</div>

{/* Hamburger menu */}
{hamburgerOpen && (
  <div className="dropdown-menu">
    {categories.map((cat) => (
      <Link
        key={cat.name}
        to={cat.path}
        onClick={() => {
          setMenu(cat.name.toLowerCase());
          setHamburgerOpen(false);
        }}
        className="dropdown-item"
      >
        {cat.name}
      </Link>
    ))}
  </div>
)}

    </div>
  );
};
