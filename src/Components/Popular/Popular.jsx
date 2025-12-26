import React, { useContext } from "react";
import "./Popular.css";
import { HomeContext } from "../../Context/HomeContext";
import Item from "../Item/Item";

const Popular = () => {
  const { products = [], loading } = useContext(HomeContext);

  if (loading) {
    return <div className="popular">Loading popular products...</div>;
  }

  // Take first 4 products from backend
  const popularProducts = products.slice(0, 4);

  return (
    <div className="popular">
      <h1>POPULAR</h1>
      <hr />

      <div className="popular_item">
        {popularProducts.map((item) => (
          <Item
            key={item._id}
            id={item._id}
            name={item.name}
            image={item.images?.[0]}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default Popular;
