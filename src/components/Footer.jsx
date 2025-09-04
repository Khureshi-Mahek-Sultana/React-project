import React from 'react';
import './ComponentStyles.css'; // Assuming styles are in this file

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: '#4CAF50', color: '#fff', padding: '20px', textAlign: 'center' }}>
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} BusBooking. All rights reserved.</p>
        <p>Contact us: support@busbooking.com</p>
      </div>
    </footer>
  );
};

export default Footer;
