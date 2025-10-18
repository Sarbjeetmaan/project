import React, { createContext, useState, useEffect } from "react";
import popularProducts from "../assets/data";
import localProducts from "../assets/allProducts";

export const HomeContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://backend-91e3.onrender.com";

const getDefaultCart = (products) => {
  let cart = {};
  for (let i = 0; i < products.length; i++) {
    cart[products[i].id] = 0;
  }
  return cart;
};

const HomeContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/allproducts`);
        const backendProducts = await res.json();

        const normalizedBackendProducts = backendProducts.map((p) => ({
          ...p,
          id: p.id || p._id,
        }));

        const mergedProducts = [
          ...localProducts,
          ...normalizedBackendProducts.filter(
            (bp) => !localProducts.some((lp) => lp.id === bp.id)
          ),
        ];

        setAllProducts(mergedProducts);
        setCartItems(getDefaultCart(mergedProducts));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setAllProducts(localProducts);
        setCartItems(getDefaultCart(localProducts));
      }
    };

    fetchProducts();
  }, []);

  // 2️⃣ Fetch user's cart from backend **after products are loaded**
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token || allProducts.length === 0) return;

      try {
        const res = await fetch(`${BACKEND_URL}/getcart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.cart) {
          const backendCart = Object.fromEntries(Object.entries(data.cart));
          // Merge backend cart with default cart to include all product IDs
          const mergedCart = { ...getDefaultCart(allProducts), ...backendCart };
          setCartItems(mergedCart);
        }
      } catch (err) {
        console.error("Error loading backend cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [allProducts]);

  // 3️⃣ Save cart whenever it changes
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

  // 4️⃣ Cart operations
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
