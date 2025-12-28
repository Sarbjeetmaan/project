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
      const orderItems = cartDetails.map((item) => {
        if (!item._id || !item.new_price) {
          throw new Error("Invalid cart item detected");
        }
        return {
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.new_price,
          image: item.images?.[0] || "",
        };
      });

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

      // 3️⃣ ONLINE payment flow
      console.log("Creating Cashfree order for orderId:", orderId);
      const cfRes = await axios.post(
        "https://backend-91e3.onrender.com/create-cashfree-order",
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Cashfree response:", cfRes.data);

      if (!cfRes.data.payment_session_id) {
        throw new Error("Cashfree session not created. Response: " + JSON.stringify(cfRes.data));
      }

      // 4️⃣ Load Cashfree Checkout
      const cashfree = await load({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: cfRes.data.payment_session_id,
        redirectTarget: "_self",
      });

    } catch (error) {
      // Detailed logging
      console.error(
        "Order/Payment Error:",
        error.response ? JSON.stringify(error.response.data, null, 2) : error.message
      );

      // Alert user
      if (paymentMethod === "ONLINE") {
        alert("💳 Payment failed. Check console for details.");
      } else if (paymentMethod === "COD") {
        alert("❌ Order placement failed. Check console for details.");
      }
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
