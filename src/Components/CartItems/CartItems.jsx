// src/Components/CartItems/CartItems.jsx
import React, { useContext } from "react";
import { HomeContext } from "../../Context/HomeContext";
import "./CartItems.css";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const { allProducts, cartItems, addToCart, decreaseQuantity, removeFromCart } =
    useContext(HomeContext);
  const navigate = useNavigate();

  const getTotal = () =>
    allProducts.reduce(
      (sum, p) => sum + (cartItems[p.id] || 0) * p.new_price,
      0
    );

  return (
    <div className="cart-container">
      <h2>Shopping Bag</h2>
      {Object.keys(cartItems).length === 0 ||
      Object.values(cartItems).every((qty) => qty === 0) ? (
        <div className="empty-cart">
          Your cart is empty.
          <button onClick={() => navigate("/")}>Go Shopping</button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {allProducts
              .filter((p) => cartItems[p.id] > 0)
              .map((product) => (
                <div key={product.id} className="cart-item">
                  <img src={product.image} alt={product.name} />
                  <div className="cart-item-info">
                    <h3>{product.name}</h3>
                    <p>₹{product.new_price}</p>
                    <div className="cart-item-qty">
                      <button onClick={() => decreaseQuantity(product.id)}>
                        -
                      </button>
                      <span>{cartItems[product.id]}</span>
                      <button onClick={() => addToCart(product.id)}>+</button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ₹{getTotal()}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartItems;
