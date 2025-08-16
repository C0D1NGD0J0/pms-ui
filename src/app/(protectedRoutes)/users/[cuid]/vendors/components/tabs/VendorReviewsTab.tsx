import React from "react";

import { VendorDetail } from "../../hooks/useGetVendor";

interface VendorReviewsTabProps {
  vendor: VendorDetail;
}

export const VendorReviewsTab: React.FC<VendorReviewsTabProps> = ({
  vendor,
}) => {
  const { reviews } = vendor;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="review-stars">
        {Array.from({ length: fullStars }, (_, i) => (
          <i key={i} className="bx bxs-star"></i>
        ))}
        {hasHalfStar && <i className="bx bxs-star-half"></i>}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }, (_, i) => (
          <i key={`empty-${i}`} className="bx bx-star"></i>
        ))}
      </div>
    );
  };

  return (
    <div className="vendor-reviews">
      <div className="info-section">
        <h4>Customer Reviews</h4>
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="review-info">
                  <div className="reviewer-name">{review.reviewer}</div>
                  <div className="review-property">{review.property}</div>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="review-date">{review.date}</span>
                </div>
              </div>
              <div className="review-content">
                <p className="review-comment">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Review Summary</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-star"></i>
            <div className="info-content">
              <div className="info-label">Average Rating</div>
              <div className="info-value">
                {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}/5.0
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-message-dots"></i>
            <div className="info-content">
              <div className="info-label">Total Reviews</div>
              <div className="info-value">{reviews.length}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-like"></i>
            <div className="info-content">
              <div className="info-label">5-Star Reviews</div>
              <div className="info-value">
                {reviews.filter(r => r.rating === 5).length}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-trending-up"></i>
            <div className="info-content">
              <div className="info-label">Recommendation Rate</div>
              <div className="info-value">
                {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorReviewsTab.displayName = 'VendorReviewsTab';