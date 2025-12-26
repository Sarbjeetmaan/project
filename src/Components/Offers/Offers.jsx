import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Offers.css';
import Video from '../../assets/icons/banner.mp4';

const Offers = () => {
  const navigate = useNavigate();

  const handleCheckNow = () => {
    // Navigate to the popular products page
    navigate('/popular'); // make sure this route exists
  };

  return (
    <div className='offers'>
      <div className="offers-left">
        <h1>Exclusive</h1>
        <h1>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCT</p>
        <button onClick={handleCheckNow}>Check Now</button>
      </div>
      <div className="offers-right">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src={Video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default Offers;
