// src/Context/HomeContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const HomeContext = createContext();
const BACKEND_URL = "https://backend-91e3.onrender.com";

export const HomeProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    // Load existing cart from localStorage
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 🧠 Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 🛍 Fetch all products
  const fetchProducts = async (retries = 3) => {
    try {
      const res = await fetch(`${BACKEND_URL}/allproducts`);
      const text = await res.text();

      if (text.trim().startsWith("<!DOCTYPE")) {
        throw new Error("Got HTML instead of JSON — retrying...");
      }

      const data = JSON.parse(text);

      const adminProducts = data.filter(
        (p) => Array.isArray(p.images) && p.images.length > 0
      );

      setProducts(adminProducts);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
      if (retries > 0) {
        console.log("Retrying in 3 seconds...");
        setTimeout(() => fetchProducts(retries - 1), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🛒 Add to Cart
  const addToCart = (productId) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { id: productId, quantity: 1 }];
      }
    });
  };

  // ➖ Remove one item (reduce quantity or delete)
  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // ❌ Clear cart completely
  const clearCart = () => setCart([]);

  return (
    <HomeContext.Provider
      value={{
        products,
        allProducts: products,
        loading,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;
