// src/Pages/ShopCategory.jsx
import React, { useContext } from 'react';
import { HomeContext } from '../Context/HomeContext';
import { Link } from 'react-router-dom';
import './CSS/ShopCategory.css';

const ShopCategory = ({ category }) => {
  const { allProducts, loading } = useContext(HomeContext);

  if (loading) return <div style={{ padding: '2rem' }}>Loading products...</div>;

  const filteredProducts = allProducts.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  if (!filteredProducts.length)
    return <div style={{ padding: '2rem', color: 'red' }}>No products found.</div>;

  return (
    <div className="shop-category">
      <h1>{category.toUpperCase()}</h1>
      <div className="shop-category-grid">
        {filteredProducts.map((item) => (
          <Link to={`/product/${item.id}`} key={item.id} className="shop-category-link">
            <div className="shop-category-item">
              <img src={item.image || item.images[0]} alt={item.name} />
              <h3>{item.name}</h3>
              <div className="shop-category-prices">
                <span className="shop-category-price-new">₹{item.new_price}</span>
                <span className="shop-category-price-old">₹{item.old_price}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopCategory;
