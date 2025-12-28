import React, { useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const PaymentForm = ({ address, cartDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login required");
        return;
      }

      if (paymentMethod === "ONLINE" && !address?.phone) {
        alert("Phone number is required for online payment");
        return;
      }

      setLoading(true);

      const orderItems = cartDetails.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.new_price,
        image: item.images?.[0],
      }));

      // 1️⃣ Create order in DB
      const orderRes = await axios.post(
        "https://backend-91e3.onrender.com/placeorder",
        {
          items: orderItems,
          address,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderId = orderRes.data.order._id;

      // 2️⃣ COD flow
      if (paymentMethod === "COD") {
        alert("Order placed successfully (Cash on Delivery)");
        window.location.href = "/orders";
        return;
      }

      // 3️⃣ Create Cashfree Order (ONLINE only)
      const cfRes = await axios.post(
        "https://backend-91e3.onrender.com/create-cashfree-order",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 4️⃣ Load Cashfree Checkout
      const cashfree = await load({ mode: "sandbox" });

      cashfree.checkout({
        paymentSessionId: cfRes.data.payment_session_id,
        redirectTarget: "_self",
      });

    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h2>Payment</h2>

      <h4>Select Payment Method</h4>

      <label>
        <input
          type="radio"
          checked={paymentMethod === "COD"}
          onChange={() => setPaymentMethod("COD")}
        />
        Cash on Delivery
      </label>

      <label>
        <input
          type="radio"
          checked={paymentMethod === "ONLINE"}
          onChange={() => setPaymentMethod("ONLINE")}
        />
        Online Payment
      </label>

      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default PaymentForm;
