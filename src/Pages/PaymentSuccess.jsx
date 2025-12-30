import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [status, setStatus] = useState("Verifying payment...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Extract order_id from query params
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("order_id");

        if (!orderId) {
          setStatus("Invalid payment redirect. No order ID found.");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setStatus("Login required to verify payment.");
          return;
        }

        // Call backend to verify payment
        const res = await axios.post(
          "https://backend-91e3.onrender.com/verify-payment",
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setStatus("✅ Payment successful! Order confirmed.");
        } else {
          setStatus(`⚠️ Payment not completed: ${res.data.message}`);
        }

        // Optionally redirect to orders page after few seconds
        setTimeout(() => navigate("/orders"), 5000);
      } catch (err) {
        console.error("Payment verification error:", err.response?.data || err.message);
        setStatus("❌ Payment verification failed. Please contact support.");
      }
    };

    verifyPayment();
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Payment Status</h2>
      <p>{status}</p>
      <p>You will be redirected shortly...</p>
    </div>
  );
};

export default PaymentSuccess;
