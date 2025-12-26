import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CSS/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view orders.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || "https://backend-91e3.onrender.com"}/orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError(res.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        setError("Something went wrong while fetching your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading your orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
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
          <p className="order-item-qty">
            Qty: {item.quantity}
          </p>
        </div>

        <div className="order-item-price">
          ₹{(item.price * item.quantity).toFixed(2)}
        </div>
      </li>
    ))}
  </ul>
</div>


              <div className="order-footer">
                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
