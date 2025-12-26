import React from 'react';


const CheckoutSummary = ({ cartDetails }) => {
  const cartTotal = cartDetails.reduce(
    (sum, item) => sum + item.new_price * item.quantity,
    0
  );

  return (
    <div className="checkout-summary">
      <h3>PRICE DETAILS</h3>

      <div className="summary-line">
        <span>Order value</span>
        <span>Rs. {cartTotal.toFixed(2)}</span>
      </div>

      <div className="summary-line">
        <span>Delivery</span>
        <span>FREE</span>
      </div>

      <hr />

      <div className="summary-line total">
        <strong>Total Payable</strong>
        <strong>Rs. {cartTotal.toFixed(2)}</strong>
      </div>

      <p className="secure-text">100% Secure Payments</p>
    </div>
  );
};

export default CheckoutSummary;
