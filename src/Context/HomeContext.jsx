// src/Context/HomeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const HomeContext = createContext(null);

const BACKEND_URL = "https://backend-91e3.onrender.com";

const HomeContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/allproducts`);
        const data = await res.json();

        // Only admin-added products
        const adminProducts = data.map((p) => ({
          id: Number(p.id),
          name: p.name,
          images: p.images || [],
          image: p.images?.[0] || "/placeholder.png",
          category: p.category || "all",
          new_price: Number(p.new_price),
          old_price: Number(p.old_price),
          available: p.available,
        }));

        setAllProducts(adminProducts);

        // Initialize cart
        const defaultCart = {};
        adminProducts.forEach((p) => (defaultCart[p.id] = 0));

        // Merge guest cart
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
        const mergedCart = { ...defaultCart };
        for (let id in guestCart) mergedCart[Number(id)] = guestCart[id];

        // Merge backend cart if logged in
        const token = localStorage.getItem("token");
        if (token) {
          const resCart = await fetch(`${BACKEND_URL}/getcart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const dataCart = await resCart.json();
          if (dataCart.success && dataCart.cart) {
            for (let [key, value] of Object.entries(dataCart.cart)) {
              mergedCart[Number(key)] = (mergedCart[Number(key)] || 0) + value;
            }
          }
          localStorage.removeItem("guestCart");
        }

        setCartItems(mergedCart);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cart operations
  const addToCart = (id) => {
    setCartItems((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const decreaseQuantity = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[id]) updated[id]--;
      if (updated[id] <= 0) delete updated[id];
      return updated;
    });
  };
  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCartItems({});
  };

  return (
    <HomeContext.Provider
      value={{
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
