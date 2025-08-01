import React, { useContext } from 'react';
import './RelatedProducts.css';
import { HomeContext } from '../../Context/HomeContext';
import Item from '../Item/Item';

const RelatedProducts = ({ currentProduct }) => {
  const { allProducts } = useContext(HomeContext);

  // Filter related by category, excluding current product
  let related = allProducts?.filter(
    (item) =>
      item.category === currentProduct.category &&
      item.id !== currentProduct.id
  );

  if (!related || related.length === 0) {
    // Fallback to 4 random products if not enough in same category
    related = allProducts
      ?.filter((item) => item.id !== currentProduct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }

  return (
    <div className="related-products">
      <h2>Related Products</h2>
      <div className="related-products-list">
        {related.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
