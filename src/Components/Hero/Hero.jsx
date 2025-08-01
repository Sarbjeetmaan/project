import React from 'react';
import Slider from 'react-slick';
import './Hero.css';

import banner1 from '../../assets/banner/airpods.webp';
import banner2 from '../../assets/banner/watches.jpg';
import banner3 from '../../assets/banner/watches2.webp';
import banner4 from '../../assets/banner/hero3.webp';

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    pauseOnHover: true,
  };

  const slides = [
    { image: banner1, link: '/airpods' },
    { image: banner2, link: '/watches' },
    { image: banner3, link: '/watches' },
    { image: banner4, link: '/mobile' },
  ];

  return (
    <div className="hero-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <a href={slide.link} key={index} className="hero-slide no-overlay">
            <img src={slide.image} alt={`Banner ${index + 1}`} />
          </a>
        ))}
      </Slider>
    </div>
  );
};

export default Hero;
