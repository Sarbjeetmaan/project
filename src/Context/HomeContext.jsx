import React, { createContext, useState, useEffect } from "react";
import popularProducts from "../assets/data";
import localProducts from "../assets/allProducts";

export const HomeContext = createContext(null);

const getDefaultCart = (products) => {
  let cart = {};
  for (let i = 0; i < products.length; i++) {
    cart[products[i].id] = 0;
  }
  return cart;
};

const BACKEND_URL = "https://backend-91e3.onrender.com"; // ✅ your backend base URL

const HomeContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([...localProducts]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // ======================================================
  // 1️ Load products from backend
  // ======================================================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/allproducts`);
        const backendProducts = await res.json();

        const normalizedBackendProducts = backendProducts.map((p) => ({
          ...p,
          id: p.id || p._id,
        }));

        const merged = [
          ...localProducts,
          ...normalizedBackendProducts.filter(
            (bp) => !localProducts.some((lp) => lp.id === bp.id)
          ),
        ];

        setAllProducts(merged);
        setCartItems(getDefaultCart(merged));
      } catch (err) {
        console.error("Failed to fetch backend products:", err);
        setAllProducts(localProducts);
        setCartItems(getDefaultCart(localProducts));
      }
    };

    fetchProducts();
  }, []);

  // ======================================================
  // 2️ Load cart from MongoDB (after login)
  // ======================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BACKEND_URL}/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.cart) {
            // convert MongoDB Map -> JS object
            setCartItems(Object.fromEntries(Object.entries(data.cart)));
          }
        })
        .catch((err) => console.error("Error loading cart:", err));
    }
  }, [isLoggedIn]);

  // ======================================================
  // 3️ Save cart to MongoDB whenever it changes
  // ======================================================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BACKEND_URL}/savecart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems }),
      }).catch((err) => console.error("Error saving cart:", err));
    }
  }, [cartItems]);

  // ======================================================
  // 4️ Cart Operations
  // ======================================================
  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev;
      const newCart = { ...prev };
      newCart[itemId] = newCart[itemId] - 1;
      if (newCart[itemId] <= 0) delete newCart[itemId];
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[itemId];
      return newCart;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartItems({});
  };

  const contextValue = {
    popularProducts,
    allProducts,
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    isLoggedIn,
    setIsLoggedIn,
    logout,
  };

  return (
    <HomeContext.Provider value={contextValue}>
      {props.children}
    </HomeContext.Provider>
  );
};

export default HomeContextProvider;
