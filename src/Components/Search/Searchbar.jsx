import React, { useState, useContext, useEffect, useRef } from "react";
import { HomeContext } from "../../Context/HomeContext";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { allProducts = [] } = useContext(HomeContext) || {}; // ✅ Safe fallback
  const navigate = useNavigate();
  const resultsRef = useRef();

  // ✅ Prevent crash if products not yet loaded
  const filteredProducts = Array.isArray(allProducts)
    ? allProducts.filter(
        (p) =>
          query &&
          (p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // ✅ Navigate to search results page
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${query}`);
      setShowResults(false);
    }
  };

  // ✅ When a product is selected
  const handleSelect = (id) => {
    setQuery("");
    setShowResults(false);
    navigate(`/product/${id}`);
  };

  // ✅ Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSearch} className="searchbar-form">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="searchbar-input"
        />
        <button type="submit" className="searchbar-button">
          🔍︎
        </button>
      </form>

      {showResults && query && (
        <div className="search-results" ref={resultsRef}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="search-item"
                onClick={() => handleSelect(p.id)}
              >
                {/* ✅ Use p.images[0] instead of p.image */}
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="search-item-img"
                />
                <div className="search-item-info">
                  <p className="search-item-name">{p.name}</p>
                  <p className="search-item-price">₹{p.new_price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No products found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
