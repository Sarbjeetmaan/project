// src/Pages/Product.jsx
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import BreadCrum from "../Components/BreadCrums/BreadCrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { HomeContext } from "../Context/HomeContext";

const Product = () => {
  const { allProducts, loading } = useContext(HomeContext);
  const { productId } = useParams();

  if (loading)
    return <div style={{ padding: "2rem" }}>Loading product...</div>;

  const product = allProducts.find((p) => Number(p.id) === Number(productId));

  if (!product) {
    return (
      <div style={{ padding: "2rem", color: "red" }}>
        Product not found (ID: {productId})
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
