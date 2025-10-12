import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeContext } from "../Context/HomeContext";
import "./CSS/SearchResults.css"; // optional CSS file for styling

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts } = useContext(HomeContext);

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q")?.toLowerCase() || "";

  // Filter products based on name or category
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
  );

  return (
    <div className="search-results-page">
      <h2 className="search-heading">
        Search results for: <span>"{query}"</span>
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="search-grid">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="search-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <img src={p.image} alt={p.name} className="search-img" />
              <div className="search-info">
                <h3 className="search-name">{p.name}</h3>
                <p className="search-price">${p.new_price}</p>
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
