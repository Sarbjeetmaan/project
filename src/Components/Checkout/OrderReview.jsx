// src/Components/Checkout/OrderReview.jsx
import React from 'react';

const OrderReview = ({ cartDetails, onNext, onBack }) => {
  const total = cartDetails.reduce((sum, item) => sum + item.new_price * item.quantity, 0);

  return (
    <div className="order-review">
      <h2>Review Order</h2>
      <ul>
        {cartDetails.map(item => (
          <li key={item._id}>
            {item.name} x {item.quantity} = ₹{(item.new_price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p><strong>Total: ₹{total.toFixed(2)}</strong></p>
      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Proceed to Payment</button>
    </div>
  );
};

export default OrderReview;
