import React, { createContext, useState, useEffect } from "react";
import popularProducts from '../assets/data';
import allProducts from '../assets/allProducts';

export const HomeContext = createContext(null);

// Initialize cart with product IDs set to 0
const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < allProducts.length; i++) {
    cart[allProducts[i].id] = 0;
  }
  return cart;
};

const HomeContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // ✅ Load cart from backend after login
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('https://backend-91e3.onrender.com/cart', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          if (data.cart) setCartItems(data.cart);
        } catch (err) {
          console.error("Failed to load cart:", err);
        }
      }
    };

    fetchCart();
  }, []);

  // ✅ Add to Cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('https://backend-91e3.onrender.com/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, quantity: 1 }),
        });
      } catch (err) {
        console.error("Error syncing addToCart:", err);
      }
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: 0,
    }));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('https://backend-91e3.onrender.com/cart/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId }),
        });
      } catch (err) {
        console.error("Error syncing removeFromCart:", err);
      }
    }
  };

  // ✅ Decrease quantity
  const decreaseQuantity = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await fetch('https://backend-91e3.onrender.com/cart/decrease', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId }),
        });
      } catch (err) {
        console.error("Error syncing decreaseQuantity:", err);
      }
    }
  };

  const contextValue = {
    popularProducts,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
  };

  return (
    <HomeContext.Provider value={contextValue}>
      {props.children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
