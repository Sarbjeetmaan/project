// src/Components/ProductDisplay/ProductDisplay.jsx
import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HomeContext } from "../../Context/HomeContext";
import { useNavigate } from "react-router-dom";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import axios from "axios";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(HomeContext);
  const navigate = useNavigate();

  const [mainImage, setMainImage] = useState("/placeholder.png");
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://backend-91e3.onrender.com";

  // Reset main image whenever product changes
  useEffect(() => {
    if (product?.images?.length) {
      setMainImage(product.images[0]);
    } else {
      setMainImage("/placeholder.png");
    }
  }, [product]);

  // Fetch reviews and eligibility
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        // Fetch reviews
        const res = await axios.get(`${API_URL}/reviews/${product._id}`);
        setReviews(res.data || []);

        // Check if user can review
        const token = localStorage.getItem("token");
        if (token) {
          const canReviewRes = await axios.get(`${API_URL}/can-review/${product._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCanReview(canReviewRes.data.canReview);
        } else {
          setCanReview(false);
        }
      } catch (err) {
        console.error("Fetch Reviews Error:", err.response?.data || err.message);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (product?._id) fetchReviews();
  }, [product]);

  const handleAddToCart = () => {
    addToCart(product._id);
    navigate("/cart");
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a comment.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/reviews`,
        {
          productId: product._id,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setRating(5);

      // Refresh reviews
      const res = await axios.get(`${API_URL}/reviews/${product._id}`);
      setReviews(res.data || []);
      setCanReview(false); // User can review only once
    } catch (err) {
      console.error("Submit Review Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  if (!product) {
    return <p className="no-product">No product selected.</p>;
  }

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

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
                onClick={() => img && setMainImage(img)}
                className={`thumb-img ${mainImage === img ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="productdisplay-img">
            <img
              className="productdisplay-main-img"
              src={mainImage}
              alt={product.name}
            />
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="productdisplay-right">
          <h1>{product.name}</h1>

          {/* STAR RATING */}
          <div className="productdisplay-right-stars">
            {[...Array(5)].map((_, idx) => {
              const starValue = idx + 1;
              if (avgRating >= starValue) return <FaStar key={idx} />;
              if (avgRating >= starValue - 0.5) return <FaStarHalfAlt key={idx} />;
              return <FaRegStar key={idx} />;
            })}
            <span>({reviews.length})</span>
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

      {/* REVIEWS SECTION */}
      <div className="product-reviews">
        <h2>Reviews</h2>

        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((r, idx) => (
              <li key={idx} className="review-item">
                <div className="review-stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < r.rating ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>
                <p className="review-comment">{r.comment}</p>
                <small className="review-user">{r.userEmail}</small>
              </li>
            ))}
          </ul>
        )}

        {/* REVIEW FORM */}
        {canReview && (
          <div className="review-form">
            <h3>Write a Review</h3>
            <label>
              Rating:
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
              />
            </label>

            <button onClick={handleSubmitReview}>Submit Review</button>
          </div>
        )}
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts currentProduct={product} />
    </div>
  );
};

export default ProductDisplay;
