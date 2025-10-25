// src/Components/CartItems/CartItems.jsx
import React, { useContext } from 'react';
import './CartItems.css';
import { HomeContext } from '../../Context/HomeContext';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const CartItems = () => {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    loading,
  } = useContext(HomeContext);

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">SHOPPING BAG</h2>
        <p>Loading your cart...</p>
      </div>
    );
  }

  // Build cart details (with product info)
  const cartDetails = cart
    .map((cartItem) => {
      const product = products.find((p) => p._id === cartItem.id);
      return product ? { ...product, quantity: cartItem.quantity } : null;
    })
    .filter(Boolean);

  const cartTotal = cartDetails.reduce(
    (sum, item) => sum + item.new_price * item.quantity,
    0
  );

  const handleDecrease = (productId) => {
    removeFromCart(productId); // removeFromCart already reduces or removes
  };

  const hasItems = cartDetails.length > 0;

  return (
    <div className="cart-container">
      <h2 className="cart-title">SHOPPING BAG</h2>
      {hasItems ? (
        <div className="cart-content">
          <div className="cart-items-section">
            {cartDetails.map((item) => (
              <div className="cart-item" key={item._id}>
                <img
                  src={item.images?.[0] || '/placeholder.png'}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p><strong>Rs. {item.new_price.toFixed(2)}</strong></p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Total: Rs. {(item.new_price * item.quantity).toFixed(2)}</p>

                  <div className="cart-item-controls">
                    <button onClick={() => handleDecrease(item._id)}>
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item._id)}>
                      <FaPlus />
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="delete-btn"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>
              DISCOUNTS <span className="cart-add">ADD</span>
            </h3>
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

            <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')} 
              >
                CONTINUE TO CHECKOUT
              </button>

            <button
              className="signin-btn"
              onClick={() => navigate('/login')}
            >
              SIGN IN
            </button>

            <div className="cart-payment-icons">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                alt="Visa"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                alt="MasterCard"
              />
              <span>Cash on Delivery</span>
            </div>

            <button className="clear-cart-btn" onClick={clearCart}>
              CLEAR CART
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
        </div>
      )}
    </div>
  );
};

export default CartItems;
