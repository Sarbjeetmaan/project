import React from 'react'
import './Offers.css'
import Video from '../../assets/icons/banner.mp4'

export const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Exclusive</h1>
            <h1>Offers For You</h1>
            <p>ONLY ON BEST SELLERS PRODUCT</p>
            <button> Check Now</button>
        </div>
        <div className="offers-right">
           <video className="hero-video" autoPlay muted loop playsInline>
        <source src={Video} type="video/mp4" />
       
      </video>
        </div>
    </div>
  )
}
export default Offers