// src/Pages/Product.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { HomeContext } from "../Context/HomeContext";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
  const { allProducts, loading } = useContext(HomeContext);
  const { productId } = useParams();

  if (loading) return <div style={{ padding: "2rem" }}>Loading product...</div>;

  const product = allProducts.find((p) => Number(p.id) === Number(productId));

  if (!product) return <div style={{ padding: "2rem", color: "red" }}>Product not found</div>;

  return <ProductDisplay product={product} />;
};

export default Product;
