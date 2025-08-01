import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrum from '../Components/BreadCrums/BreadCrum';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { HomeContext } from '../Context/HomeContext';

export const Product = () => {
  const { allProducts } = useContext(HomeContext);
  const { productId } = useParams();

  // Ensure both sides are numbers
  const product = allProducts.find((e) => e.id === Number(productId));

  if (!product) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        Product not found or still loading...
        <br />
        ID from URL: {productId}
        <br />
        Total products loaded: {allProducts.length}
      </div>
    );
  }

  return (
    <div>
      <BreadCrum product={product} />
      <ProductDisplay product={product} />
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default Product;
