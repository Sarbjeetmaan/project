import React, { useEffect } from 'react';

import './Footer.css';
const Footer = () => {
  useEffect(() => {
    const headers = document.querySelectorAll('.footer-col h4');
    headers.forEach(header => {
      header.onclick = () => {
        const parent = header.parentElement;
        parent.classList.toggle('open');
      };
    });
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Column 1: Branding */}
        <div className="footer-col">
          <h2 className="footer-logo">Eloc</h2>
          <p className="footer-tagline">Innovating your world.</p>
        </div>

        {/* Column 2: Shop */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>AirPods</li>
            <li>Watches</li>
            <li>Chargers</li>
            <li>Accessories</li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div className="footer-col">
          <h4>Support</h4>
          <ul>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>Warranty</li>
            <li>Shipping Info</li>
          </ul>
        </div>

        {/* Column 4: Follow */}
        <div className="footer-col">
          <h4>Follow Us</h4>
          <div className="footer-socials">
            <i className="fab fa-instagram"></i>
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-youtube"></i>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="footer-bottom">
        <p>© 2025 Eloc. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
