import React, { useContext, useState } from 'react';
import './ProductDisplay.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { HomeContext } from '../../Context/HomeContext';
import { useNavigate } from 'react-router-dom';

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(HomeContext);
  const [mainImage, setMainImage] = useState(product.images?.[0] || product.image);
  const navigate = useNavigate();

  // Handle add to cart + navigate
  const handleAddToCart = () => {
    addToCart(product.id);   // add product to cart (context function)
    navigate('/cart');       // navigate to cart page
  };

  return (
    <div className='productdisplay'>
      {/* Left - Product Images */}
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {(product.images || [product.image]).map((img, idx) => (
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
          <img className='productdisplay-main-img' src={mainImage} alt={product.name} />
        </div>
      </div>

      {/* Right - Product Content */}
      <div className="productdisplay-right-scrollable">
        <div className="productdisplay-right">
          <h1>{product.name}</h1>

          <div className="productdisplay-right-stars">
            <FaStar /><FaStar /><FaStar /><FaStarHalfAlt /><FaRegStar />
            <span>(122)</span>
          </div>

          <div className="productdisplay-right-prices">
            <span className="old-price">₹{product.old_price}</span>
            <span className="new-price">₹{product.new_price}</span>
          </div>

          <div className="productdisplay-right-description">
            <p>
              Introducing the premium quality {product.name}. Built with top-grade materials
              and designed for both performance and elegance. A must-have addition to your tech lifestyle.
            </p>
          </div>

          {/* Updated button */}
          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>

          {/* Reviews Section */}
          <div className="productdisplay-reviews">
            <h2>Customer Reviews</h2>

            <div className="review">
              <div className="review-stars">
                <FaStar /><FaStar /><FaStar /><FaStarHalfAlt /><FaRegStar />
              </div>
              <p><strong>Aarav</strong> – “Great quality and value for money. Highly recommend!”</p>
            </div>

            <div className="review">
              <div className="review-stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p><strong>Priya</strong> – “Absolutely love this product! Will buy again.”</p>
            </div>

            <div className="review">
              <div className="review-stars">
                <FaStar /><FaStar /><FaStar /><FaRegStar /><FaRegStar />
              </div>
              <p><strong>Rohan</strong> – “It's decent but delivery took a bit longer.”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
