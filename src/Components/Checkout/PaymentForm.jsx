import React, { useState } from "react";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";

const PaymentForm = ({ address, cartDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
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

    try {
      if (!cartDetails || cartDetails.length === 0) {
        alert("Your cart is empty");
        return;
      }

      // Prepare order items
      const orderItems = cartDetails.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.new_price,
        image: item.images?.[0] || "",
      }));

      console.log("Placing order with items:", orderItems, "and address:", address);

      // 1️⃣ Create order in backend
      const orderRes = await axios.post(
        "https://backend-91e3.onrender.com/placeorder",
        { items: orderItems, address, paymentMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderId = orderRes.data.order._id;
      console.log("Order created successfully:", orderRes.data.order);

      // 2️⃣ COD flow
      if (paymentMethod === "COD") {
        alert("✅ Order placed successfully (Cash on Delivery)");
        window.location.href = "/orders";
        return;
      }

      // 3️⃣ ONLINE payment flow: get Cashfree session ID
      const cfRes = await axios.post(
        "https://backend-91e3.onrender.com/create-cashfree-order",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sessionId = cfRes.data.payment_session_id;
      if (!sessionId) {
        throw new Error("Cashfree session not created");
      }

      console.log("Cashfree session ID:", sessionId);

      // 4️⃣ Load Cashfree Checkout
      const cashfree = await load({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: sessionId,
        redirectTarget: "_self",
      });

    } catch (error) {
      console.error(
        "Order/Payment Error:",
        error.response ? error.response.data : error.message
      );
      alert("💳 Payment failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // 5️⃣ Verify payment (optional, call on payment-success page)
  const verifyPayment = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post(
        "https://backend-91e3.onrender.com/verify-payment",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ Payment verified successfully!");
        window.location.href = "/orders";
      } else {
        alert("⚠ Payment not completed. Please try again.");
      }
    } catch (err) {
      console.error("Verify Payment Error:", err.response?.data || err.message);
      alert("⚠ Payment verification failed. Check console.");
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
