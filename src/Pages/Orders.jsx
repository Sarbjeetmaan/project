// src/Components/Orders/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./CSS/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({}); // { [productId]: { rating, comment } }

  const API_URL = import.meta.env.VITE_API_URL || "https://backend-91e3.onrender.com";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view orders.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setOrders(res.data.orders || []);
        } else {
          setError(res.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError(err.response?.data?.message || "Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleReviewChange = (productId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSubmitReview = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      return;
    }

    const { rating, comment } = reviewInputs[productId] || {};
    if (!comment?.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/reviews`,
        { productId, rating: Number(rating), comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Review submitted successfully!");
      setReviewInputs((prev) => ({ ...prev, [productId]: { rating: 5, comment: "" } }));
    } catch (err) {
      console.error("Submit Review Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) return <p className="loading">Loading your orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const totalAmount =
              order.totalAmount ||
              order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <p>
                    <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                  </p>
                </div>

                <div className="order-body">
                  <ul className="order-items">
                    {order.items.map((item) => (
                      <li key={item.productId} className="order-item">
                        <img
                          src={item.image || item.images?.[0] || "/placeholder.png"}
                          alt={item.name}
                          className="order-item-img"
                        />
                        <div className="order-item-info">
                          <p className="order-item-name">{item.name}</p>
                          <p className="order-item-qty">Qty: {item.quantity}</p>
                        </div>
                        <div className="order-item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>

                        {/* Show review form only if order is delivered */}
                        {order.status === "Delivered" && (
                          <div className="order-item-review">
                            <h4>Write a Review</h4>
                            <label>
                              Rating:
                              <select
                                value={reviewInputs[item.productId]?.rating || 5}
                                onChange={(e) =>
                                  handleReviewChange(item.productId, "rating", e.target.value)
                                }
                              >
                                {[5, 4, 3, 2, 1].map((r) => (
                                  <option key={r} value={r}>
                                    {r}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Comment:
                              <textarea
                                value={reviewInputs[item.productId]?.comment || ""}
                                onChange={(e) =>
                                  handleReviewChange(item.productId, "comment", e.target.value)
                                }
                                placeholder="Write your review here..."
                              />
                            </label>
                            <button onClick={() => handleSubmitReview(item.productId)}>
                              Submit Review
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-footer">
                  <p>
                    <strong>Total Amount:</strong> ₹{totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
