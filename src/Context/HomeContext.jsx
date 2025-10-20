// src/Context/HomeContext.jsx
import React, { createContext, useState, useEffect } from "react";
import popularProducts from "../assets/data";
import localProducts from "../assets/allProducts";

export const HomeContext = createContext(null);

const BACKEND_URL = "https://backend-91e3.onrender.com";

const getDefaultCart = (products) => {
  const cart = {};
  products.forEach((p) => (cart[p.id] = 0));
  return cart;
};

const HomeContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ---------------- Load products & cart ----------------
  useEffect(() => {
    const initialize = async () => {
      try {
        const resProducts = await fetch(`${BACKEND_URL}/allproducts`);
        const backendProducts = await resProducts.json();

        // Normalize backend products
        const normalizedBackendProducts = backendProducts.map((p, index) => {
          const fixedImages = (p.images || [p.image || ""])
            .filter(Boolean)
            .map((img) =>
              img.startsWith("http")
                ? img
                : `${BACKEND_URL.replace(/\/$/, "")}${
                    img.startsWith("/") ? "" : "/"
                  }${img}`
            );

          return {
            ...p,
            id: Number(p.id || p._id || 7000 + index),
            category: p.category || "all", // ✅ ensures category filter always works
            images: fixedImages,
            image: fixedImages[0] || "/placeholder.png",
          };
        });

        // Merge local + backend
        const mergedProducts = [...localProducts, ...normalizedBackendProducts];
        setAllProducts(mergedProducts);

        // Default cart
        const defaultCart = getDefaultCart(mergedProducts);

        // Guest cart
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
        const mergedCart = { ...defaultCart };
        for (let id in guestCart) mergedCart[Number(id)] = guestCart[id];

        // Backend cart
        const token = localStorage.getItem("token");
        if (token) {
          const resCart = await fetch(`${BACKEND_URL}/getcart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await resCart.json();
          if (data.success && data.cart) {
            for (let [key, value] of Object.entries(data.cart)) {
              mergedCart[Number(key)] =
                (mergedCart[Number(key)] || 0) + value;
            }
          }
          localStorage.removeItem("guestCart");
        }

        setCartItems(mergedCart);
      } catch (err) {
        console.error("Error loading products:", err);
        setAllProducts(localProducts);
        setCartItems(getDefaultCart(localProducts));
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // ---------------- Save cart ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const saveCart = async () => {
      try {
        await fetch(`${BACKEND_URL}/savecart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cartItems }),
        });
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    };
    saveCart();
  }, [cartItems]);

  // ---------------- Cart operations ----------------
  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      if (!isLoggedIn)
        localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    });
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const updated = { ...prev };
      updated[itemId]--;
      if (updated[itemId] <= 0) delete updated[itemId];
      if (!isLoggedIn)
        localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      if (!isLoggedIn)
        localStorage.setItem("guestCart", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartItems(getDefaultCart(allProducts));
  };

  return (
    <HomeContext.Provider
      value={{
        popularProducts,
        allProducts,
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        loading,
      }}
    >
      {props.children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
