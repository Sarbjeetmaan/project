// src/Pages/SearchResults.jsx
import React, { useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeContext } from "../Context/HomeContext";
import "./CSS/SearchResults.css";

const SearchResults = () => {
  const { allProducts = [] } = useContext(HomeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return allProducts.filter(
      (p) =>
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
    );
  }, [query, allProducts]);

  return (
    <div className="search-results-page">
      <h2 className="search-heading">
        Search results for: <span>"{query}"</span>
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="search-grid">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="search-card"
              onClick={() => navigate(`/product/${p._id}`)}
            >
              <img
                src={p.images?.[0] || "/placeholder.png"}
                alt={p.name}
                className="search-img"
              />
              <div className="search-info">
                <h3 className="search-name">{p.name}</h3>
                <p className="search-price">₹{p.new_price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No products found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchResults;
