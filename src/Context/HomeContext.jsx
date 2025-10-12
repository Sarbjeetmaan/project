import React, { createContext, useState, useEffect } from "react";
import popularProducts from '../assets/data';
import localProducts from '../assets/allProducts'; // renamed for clarity

export const HomeContext = createContext(null);

// Initialize cart with product IDs set to 0
const getDefaultCart = (products) => {
  let cart = {};
  for (let i = 0; i < products.length; i++) {
    cart[products[i].id] = 0;
  }
  return cart;
};

const HomeContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [allProducts, setAllProducts] = useState([...localProducts]); // start with local products
useEffect(() => {
  const fetchProducts = async () => {
    try {
      // ✅ 1. Use your deployed backend, not localhost
      const res = await fetch("https://backend-91e3.onrender.com/allproducts");

      // ✅ 2. Parse JSON
      const backendProducts = await res.json();

      // ✅ 3. Normalize _id → id (MongoDB uses _id)
      const normalizedBackendProducts = backendProducts.map((p) => ({
        ...p,
        id: p.id || p._id,
      }));

      // ✅ 4. Merge local + backend products (avoid duplicates)
      const mergedProducts = [
        ...localProducts,
        ...normalizedBackendProducts.filter(
          (bp) => !localProducts.some((lp) => lp.id === bp.id)
        ),
      ];

      // ✅ 5. Update state
      setAllProducts(mergedProducts);
      setCartItems(getDefaultCart(mergedProducts));
    } catch (err) {
      console.error("Failed to fetch backend products:", err);

      // fallback to local data
      setAllProducts(localProducts);
      setCartItems(getDefaultCart(localProducts));
    }
  };

  fetchProducts();
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
