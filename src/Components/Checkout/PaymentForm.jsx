// src/Components/Checkout/PaymentForm.jsx
import React from "react";
import axios from "axios";

const PaymentForm = ({ address, cartDetails }) => {
  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to place an order");
        return;
      }

      const orderItems = cartDetails.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.new_price,
        image: item.images?.[0],
      }));

      const res = await axios.post(
        "https://backend-91e3.onrender.com/placeorder",
        { items: orderItems, address },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("✅ Order placed successfully!");
        window.location.href = "/orders";
      } else {
        alert("❌ Failed to place order: " + res.data.message);
      }
    } catch (err) {
      console.error("Place Order Error:", err);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="payment-form">
      <h2>Payment & Place Order</h2>
      <h4>Shipping Address</h4>
      <p>{address.name}</p>
      <p>
        {address.address}, {address.city}, {address.state} - {address.zip}
      </p>
      <p>Phone: {address.phone}</p>

      <h4>Order Summary</h4>
      <ul>
        {cartDetails.map((item) => (
          <li key={item._id}>
            {item.name} × {item.quantity} = ₹
            {(item.new_price * item.quantity).toFixed(2)}
          </li>
        ))}
      </ul>

      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default PaymentForm;
