// src/Context/HomeContext.jsx
import React, { createContext, useEffect, useState } from "react";

export const HomeContext = createContext();

const BACKEND_URL = "https://backend-91e3.onrender.com";

export const HomeProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (retries = 3) => {
    try {
      const res = await fetch(`${BACKEND_URL}/allproducts`);
      const text = await res.text();

      // If backend returns HTML (Render cold start)
      if (text.trim().startsWith("<!DOCTYPE")) {
        throw new Error("Got HTML instead of JSON — retrying...");
      }

      const data = JSON.parse(text);

      // ✅ Only keep admin-uploaded products (from Cloudinary)
      const adminProducts = data.filter(
        (p) =>
          Array.isArray(p.images) &&
          p.images.length > 0 &&
          p.images[0].includes("res.cloudinary.com")
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

  return (
    <HomeContext.Provider value={{ products, loading }}>
      {children}
    </HomeContext.Provider>
  );
};
