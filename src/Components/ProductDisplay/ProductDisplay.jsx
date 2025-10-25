import React, { useContext, useState } from "react";
import "./ProductDisplay.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HomeContext } from "../../Context/HomeContext";
import { useNavigate } from "react-router-dom";
import RelatedProducts from "../RelatedProducts/RelatedProducts"; 

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(HomeContext);
  const [mainImage, setMainImage] = useState(
    product?.images?.[0] || "/placeholder.png"
  );
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product._id);
    navigate("/cart");
  };

  if (!product) return <p className="no-product">No product selected.</p>;

  return (
    <div className="productdisplay-wrapper">
      <div className="productdisplay">
        {/* LEFT SIDE - IMAGES */}
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            {product.images?.map((img, idx) => (
              <img
                key={idx}
                src={img || "/placeholder.png"}
                alt={`${product.name}-${idx}`}
                onClick={() => setMainImage(img)}
                className={`thumb-img ${mainImage === img ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="productdisplay-img">
            <img
              className="productdisplay-main-img"
              src={mainImage || "/placeholder.png"}
              alt={product.name}
            />
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="productdisplay-right">
          <h1>{product.name}</h1>

          <div className="productdisplay-right-stars">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStarHalfAlt />
            <FaRegStar />
            <span>(122)</span>
          </div>

          <div className="productdisplay-right-prices">
            <span className="old-price">₹{product.old_price}</span>
            <span className="new-price">₹{product.new_price}</span>
          </div>

          <p className="productdisplay-right-description">
            Experience premium {product.name} crafted with precision and
            cutting-edge design. Built for performance and comfort.
          </p>

          <button onClick={handleAddToCart} className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDisplay;
