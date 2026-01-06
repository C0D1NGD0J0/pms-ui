import React from "react";
import { Button } from "@components/FormElements";
import { EmployeeTag, StatusBadge } from "@components/Badge";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorProfileHeaderProps {
  vendor: VendorDetailResponse;
  onSendMessage?: () => void;
  onViewContract?: () => void;
}

export const VendorProfileHeader: React.FC<VendorProfileHeaderProps> = ({
  vendor,
  onSendMessage,
  onViewContract,
}) => {
  const { vendorInfo, profile } = vendor;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="vendor-rating">
        <div className="stars">
          {Array.from({ length: fullStars }, (_, i) => (
            <i
              key={i}
              className="bx bxs-star"
              style={{ color: "hsl(39, 73%, 49%)" }}
            ></i>
          ))}
          {hasHalfStar && (
            <i
              className="bx bxs-star-half"
              style={{ color: "hsl(39, 73%, 49%)" }}
            ></i>
          )}
          {Array.from(
            { length: 5 - fullStars - (hasHalfStar ? 1 : 0) },
            (_, i) => (
              <i
                key={`empty-${i}`}
                className="bx bx-star"
                style={{ color: "hsl(213, 14%, 56%)" }}
              ></i>
            )
          )}
        </div>
        <span className="rating-text">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="employee-header">
      <div className="employee-header-top">
        <div className="employee-profile">
          <div className="employee-avatar">
            {vendorInfo?.companyName
              ?.split(" ")
              ?.map((word) => word[0])
              ?.join("")
              ?.toUpperCase()
              ?.slice(0, 2)}
            <StatusBadge
              status={profile.isActive ? "active" : "inactive"}
              variant="text"
              className="employee-status"
            >
              {profile.isActive ? "Active" : "Inactive"}
            </StatusBadge>
          </div>

          <div className="employee-info">
            <h1>{vendorInfo?.companyName}</h1>
            <div className="employee-meta">
              <span className="employee-role">{vendorInfo?.businessType}</span>
              <div className="vendor-rating-container">
                {renderStars(parseFloat(vendorInfo?.stats?.rating || "0"))}
              </div>
            </div>

            <div className="employee-tags">
              {vendorInfo?.tags?.map((tag, index) => (
                <EmployeeTag
                  key={index}
                  icon={<i className="bx bx-check-circle"></i>}
                  variant="achievement"
                  size="default"
                >
                  {tag}
                </EmployeeTag>
              ))}
            </div>
          </div>

          <div className="employee-actions">
            <Button
              label="Send Message"
              className="btn btn-primary"
              onClick={onSendMessage}
              icon={<i className="bx bx-message-dots"></i>}
            />
            <Button
              label="View Contract"
              className="btn btn-outline"
              onClick={onViewContract}
              icon={<i className="bx bx-file-doc"></i>}
            />
          </div>
        </div>
      </div>

      <div className="employee-stats">
        <div className="stat-item">
          <span className="stat-number">{vendorInfo?.totalRevenue}</span>
          <span className="stat-label">Revenue</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{vendorInfo?.totalProjects}</span>
          <span className="stat-label">Total Projects</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{vendorInfo?.activeProjects}</span>
          <span className="stat-label">Active Projects</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{vendorInfo?.stats?.onTimeRate}</span>
          <span className="stat-label">On-Time Rate</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{vendorInfo?.stats?.responseTime}</span>
          <span className="stat-label">Response Time</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">85%</span>
          <span className="stat-label">Repeat Rate</span>
        </div>
      </div>
    </div>
  );
};
