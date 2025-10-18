import React, { useContext, useState, useEffect } from 'react';
import './CartItems.css';
import { HomeContext } from '../../Context/HomeContext';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const CartItems = () => {
  const {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    isLoggedIn,
  } = useContext(HomeContext);

  const [loading, setLoading] = useState(true); // ✅ loading state

  const navigate = useNavigate();

  // ✅ Set loading to false once products are loaded
  useEffect(() => {
    if (allProducts.length > 0) {
      setLoading(false);
    }
  }, [allProducts]);

  // Calculate total
  const cartTotal = allProducts.reduce((total, product) => {
    return total + (product.new_price * (cartItems[product.id] || 0));
  }, 0);

  if (loading) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">SHOPPING BAG</h2>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">SHOPPING BAG</h2>
      <div className="cart-content">

        {/* Left: Cart Items */}
        <div className="cart-items-section">
          {allProducts.map((item) => {
            if (cartItems[item.id] > 0) {
              return (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p><strong>Rs. {item.new_price.toFixed(2)}</strong></p>
                    <p>Quantity: {cartItems[item.id]}</p>
                    <p>Total: Rs. {(item.new_price * cartItems[item.id]).toFixed(2)}</p>

                    <div className="cart-item-controls">
                      <button onClick={() => decreaseQuantity(item.id)}><FaMinus /></button>
                      <span>{cartItems[item.id]}</span>
                      <button onClick={() => addToCart(item.id)}><FaPlus /></button>
                      <button onClick={() => removeFromCart(item.id)} className="delete-btn">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary">
          <h3>DISCOUNTS <span className="cart-add">ADD</span></h3>
          <div className="cart-summary-line">
            <span>Order value</span>
            <span>Rs. {cartTotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-line">
            <span>Estimated delivery fee</span>
            <span>Free</span>
          </div>
          <hr />
          <div className="cart-summary-line total">
            <strong>TOTAL</strong>
            <strong>Rs. {cartTotal.toFixed(2)}</strong>
          </div>

          <button className="checkout-btn">CONTINUE TO CHECKOUT</button>

          {!isLoggedIn && (
            <button className="signin-btn" onClick={() => navigate('/login')}>
              SIGN IN
            </button>
          )}

          <div className="cart-payment-icons">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" />
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
