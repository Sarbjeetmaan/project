// src/Pages/ShopCategory.jsx
import React, { useContext } from "react";
import { HomeContext } from "../Context/HomeContext";
import { Link } from "react-router-dom";
import "./CSS/ShopCategory.css";

const ShopCategory = ({ category }) => {
  const { products, loading } = useContext(HomeContext);

  if (loading) return <p className="loading">Loading products...</p>;
  if (!products || products.length === 0)
    return <p className="no-products">No admin products found.</p>;

  // ✅ Filter products by category (case-insensitive)
  const filteredProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() === category?.toLowerCase()
  );

  if (filteredProducts.length === 0)
    return (
      <p className="no-products">
        No products found in category: <strong>{category}</strong>
      </p>
    );

  return (
    <div className="shop-category">
      <h1>{category?.toUpperCase()}</h1>

      <div className="shop-category-grid">
        {filteredProducts.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="shop-category-item"
          >
            <img
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
            />
            <h3>{product.name}</h3>
            <div className="shop-category-prices">
              <span className="shop-category-price-new">
                ₹{product.new_price}
              </span>
              <span className="shop-category-price-old">
                ₹{product.old_price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopCategory;
