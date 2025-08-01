import React, { createContext, useState } from "react";
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

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: prev[itemId] + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: 0,
    }));
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));
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