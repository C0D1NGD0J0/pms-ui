import React from "react";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorPerformanceTabProps {
  vendor: VendorDetailResponse;
}

export const VendorPerformanceTab: React.FC<VendorPerformanceTabProps> = ({
  vendor,
}) => {
  const performance = vendor.vendorInfo?.performance;
  const statistics = vendor.vendorInfo?.stats;

  return (
    <div className="vendor-performance">
      <div className="info-section">
        <h4>Performance Metrics</h4>
        <div className="performance-grid">
          <div className="performance-card">
            <span className="performance-value">
              {performance?.avgResponseTime || statistics?.responseTime || 'N/A'}
            </span>
            <span className="performance-label">Avg Response Time</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">
              {performance?.completionRate || statistics?.onTimeRate || 'N/A'}
            </span>
            <span className="performance-label">Completion Rate</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">
              {performance?.customerRating || statistics?.rating || 'N/A'}
            </span>
            <span className="performance-label">Customer Rating</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">
              {performance?.repeatRate || 'N/A'}
            </span>
            <span className="performance-label">Repeat Rate</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Business Statistics</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-dollar-circle"></i>
            <div className="info-content">
              <div className="info-label">Total Revenue</div>
              <div className="info-value">
                {vendor.vendorInfo?.totalRevenue || 'N/A'}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-task"></i>
            <div className="info-content">
              <div className="info-label">Total Projects</div>
              <div className="info-value">
                {vendor.vendorInfo?.totalProjects || statistics?.completedJobs || 0}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-time-five"></i>
            <div className="info-content">
              <div className="info-label">Active Projects</div>
              <div className="info-value">
                {vendor.vendorInfo?.activeProjects || statistics?.activeJobs || 0}
              </div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-check-double"></i>
            <div className="info-content">
              <div className="info-label">On-Time Rate</div>
              <div className="info-value">{statistics?.onTimeRate || 'N/A'}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-timer"></i>
            <div className="info-content">
              <div className="info-label">Response Time</div>
              <div className="info-value">{statistics?.responseTime || 'N/A'}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-star"></i>
            <div className="info-content">
              <div className="info-label">Rating</div>
              <div className="info-value">{statistics?.rating || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Quality Metrics</h4>
        <div className="quality-grid">
          <div className="quality-item">
            <div className="quality-header">
              <i className="bx bx-star"></i>
              <span>Customer Satisfaction</span>
            </div>
            <div className="quality-rating">
              <span className="rating-value">{statistics?.rating || 'N/A'}</span>
              <div className="rating-stars">
                {/* Add star rating visual if needed */}
              </div>
            </div>
          </div>
          
          <div className="quality-item">
            <div className="quality-header">
              <i className="bx bx-time"></i>
              <span>Punctuality Score</span>
            </div>
            <div className="quality-score">
              <span className="score-value">{statistics?.onTimeRate || 'N/A'}</span>
            </div>
          </div>
          
          <div className="quality-item">
            <div className="quality-header">
              <i className="bx bx-check-shield"></i>
              <span>Work Quality</span>
            </div>
            <div className="quality-score">
              <span className="score-value">{performance?.customerRating || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Performance Trends</h4>
        <div className="performance-trend">
          <p className="trend-description">
            This vendor maintains excellent performance metrics with consistent
            delivery and high customer satisfaction ratings. Response times are
            {statistics?.responseTime ? ` averaging ${statistics.responseTime}` : ' competitive'}, 
            and the {statistics?.onTimeRate ? `${statistics.onTimeRate} on-time rate` : 'completion rate'} 
            indicates strong project management capabilities.
          </p>
          
          {vendor.vendorInfo?.tags && vendor.vendorInfo.tags.length > 0 && (
            <div className="performance-tags">
              <h5>Performance Highlights:</h5>
              <div className="tags-container">
                {vendor.vendorInfo.tags.map((tag, index) => (
                  <span key={index} className="performance-tag">
                    <i className="bx bx-badge-check"></i>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

VendorPerformanceTab.displayName = "VendorPerformanceTab";