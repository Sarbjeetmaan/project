// src/Pages/Product.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { HomeContext } from "../Context/HomeContext";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
  const { products = [], loading } = useContext(HomeContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!loading && products.length > 0) {
      const p = products.find((prod) => String(prod._id) === String(productId));
      setProduct(p || null);

      // Scroll to top when navigating to a new product
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productId, products, loading]); // ✅ watch productId

  if (loading)
    return <div style={{ padding: "2rem" }}>Loading product...</div>;
  if (!products.length)
    return <div style={{ padding: "2rem" }}>No products available.</div>;
  if (!product)
    return (
      <div style={{ padding: "2rem", color: "red" }}>Product not found</div>
    );

  return <ProductDisplay product={product} />;
};

export default Product;
