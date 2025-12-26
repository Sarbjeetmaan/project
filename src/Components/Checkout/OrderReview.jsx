// src/Components/Checkout/OrderReview.jsx
import React from 'react';

const OrderReview = ({ cartDetails, onNext, onBack }) => {
  const total = cartDetails.reduce(
    (sum, item) => sum + item.new_price * item.quantity,
    0
  );

  return (
    <div className="order-review">
      <h2>Review Order</h2>

      <ul className="order-review-list">
        {cartDetails.map(item => (
          <li key={item._id} className="order-review-item">
            <img
              src={item.images?.[0] || '/placeholder.png'}
              alt={item.name}
              className="order-review-img"
            />

            <div className="order-review-info">
              <h4>{item.name}</h4>
              <p>Qty: {item.quantity}</p>
            </div>

            <div className="order-review-price">
              ₹{(item.new_price * item.quantity).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>

      <p className="order-review-total">
        <strong>Total: ₹{total.toFixed(2)}</strong>
      </p>

      <div className="order-review-actions">
        <button className="back-btn" onClick={onBack}>
          Back
        </button>
        <button className="next-btn" onClick={onNext}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default OrderReview;
