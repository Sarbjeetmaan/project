 import React from 'react';
import './BreadCrum.css';
import { FaAngleRight } from 'react-icons/fa';

const BreadCrum = ({ product }) => {
  return (
    <div className="breadcrumb">
      HOME <FaAngleRight />
      <span> SHOP </span> <FaAngleRight />
      <span> {product.category} </span> <FaAngleRight />
      <span>{product.name}</span>
    </div>
  );
};

export default BreadCrum;