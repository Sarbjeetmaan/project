// src/Components/ProductDisplay/ProductDisplay.jsx
import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { HomeContext } from '../../Context/HomeContext';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(HomeContext);
  const [mainImage, setMainImage] = useState(product.images?.[0] || '/placeholder.png');
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product.id);
    navigate('/cart');
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {product.images?.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumb-${idx}`}
              onClick={() => setMainImage(img)}
              className={mainImage === img ? 'active-thumb' : ''}
            />
          ))}
        </div>

        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={mainImage} alt={product.name} />
        </div>
      </div>

      <div className="productdisplay-right-scrollable">
        <div className="productdisplay-right">
          <h1>{product.name}</h1>

          <div className="productdisplay-right-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
            <FaRegStar />
            <span>(122)</span>
          </div>

          <div className="productdisplay-right-prices">
            <span className="old-price">₹{product.old_price}</span>
            <span className="new-price">₹{product.new_price}</span>
          </div>

          <p className="productdisplay-right-description">
            Premium {product.name} crafted with excellence and attention to
            detail. Perfect for those who appreciate quality and performance.
          </p>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
