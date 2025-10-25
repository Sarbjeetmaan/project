// src/Components/RelatedProducts/RelatedProducts.jsx
import React, { useContext } from "react";
import "./RelatedProducts.css";
import { HomeContext } from "../../Context/HomeContext";
import { useNavigate } from "react-router-dom";

const RelatedProducts = ({ currentProduct }) => {
  const { products, loading } = useContext(HomeContext); // ✅ updated
  const navigate = useNavigate();

  if (loading || !products) return null; // ✅ prevent errors while loading

  // Filter related products by same category (excluding current product)
  let related = products.filter(
    (item) =>
      item.category === currentProduct.category &&
      item._id !== currentProduct._id
  );

  // Fallback: pick 4 random products if none in same category
  if (!related || related.length === 0) {
    related = products
      .filter((item) => item._id !== currentProduct._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-list">
        {related.map((item) => (
          <div
            key={item._id}
            className="related-item"
            onClick={() => navigate(`/product/${item._id}`)}
          >
            <img src={item.images?.[0] || "/placeholder.png"} alt={item.name} />
            <h3>{item.name}</h3>
            <p>₹{item.new_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
