import React, { createContext, useState, useEffect } from "react";
import popularProducts from "../assets/data";
import localProducts from "../assets/allProducts";

export const HomeContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || "https://backend-91e3.onrender.com";

// Initialize cart with 0 quantities for all products
const getDefaultCart = (products) => {
  const cart = {};
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

  // -------------------------------
  // 1️⃣ Fetch products and cart
  // -------------------------------
  useEffect(() => {
    const fetchProductsAndCart = async () => {
      try {
        // Fetch products
        const resProducts = await fetch(`${BACKEND_URL}/allproducts`);
        const backendProducts = await resProducts.json();

        const normalizedBackendProducts = backendProducts.map(p => ({
          ...p,
          id: Number(p.id || p._id),
          images: p.images || [p.image],
        }));

        const mergedProducts = [...localProducts, ...normalizedBackendProducts];
        setAllProducts(mergedProducts);

        // Prepare default cart
        let mergedCart = getDefaultCart(mergedProducts);

        // Merge guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '{}');
        for (let id in guestCart) mergedCart[Number(id)] = guestCart[id];

        // If logged in, fetch backend cart
        const token = localStorage.getItem("token");
        if (token) {
          const resCart = await fetch(`${BACKEND_URL}/getcart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await resCart.json();

          if (data.success && data.cart) {
            const backendCart = {};
            for (let [key, value] of Object.entries(data.cart)) {
              backendCart[Number(key)] = value;
            }

            // Merge backend cart with guest cart (sum quantities)
            for (let id in backendCart) {
              mergedCart[id] = (mergedCart[id] || 0) + backendCart[id];
            }
          }

          // Clear guest cart after merging
          localStorage.removeItem('guestCart');
        }

        setCartItems(mergedCart);

      } catch (err) {
        console.error("Error fetching products or cart:", err);
        setAllProducts(localProducts);
        setCartItems(getDefaultCart(localProducts));
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCart();
  }, []);

  // -------------------------------
  // 2️⃣ Save cart to backend on change
  // -------------------------------
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

  // -------------------------------
  // 3️⃣ Cart operations
  // -------------------------------
  const addToCart = (itemId) => {
    setCartItems(prev => {
      const newCart = { ...prev, [itemId]: (prev[itemId] || 0) + 1 };
      if (!isLoggedIn) localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prev => {
      const newCart = { ...prev };
      newCart[itemId] = (newCart[itemId] || 0) - 1;
      if (newCart[itemId] < 0) newCart[itemId] = 0;
      if (!isLoggedIn) localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => {
      const newCart = { ...prev, [itemId]: 0 };
      if (!isLoggedIn) localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  // -------------------------------
  // 4️⃣ Logout
  // -------------------------------
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
