// src/Pages/ShopCategory.jsx
import React, { useContext } from "react";
import { HomeContext } from "../Context/HomeContext";
import { Link } from "react-router-dom";
import "./CSS/ShopCategory.css";

const ShopCategory = () => {
  const { products, loading } = useContext(HomeContext);

  if (loading) return <p className="loading">Loading products...</p>;
  if (!products.length)
    return <p className="no-products">No admin products found.</p>;

  return (
    <div className="shop-category">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`} className="product-card">
          <img src={product.images[0]} alt={product.name} />
          <h3>{product.name}</h3>
          <p className="price">
            <span className="new-price">₹{product.new_price}</span>{" "}
            <span className="old-price">₹{product.old_price}</span>
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ShopCategory;
