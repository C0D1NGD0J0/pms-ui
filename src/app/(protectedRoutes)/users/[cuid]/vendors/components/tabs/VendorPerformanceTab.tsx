import React from "react";

import { VendorDetail } from "../../hooks/useGetVendor";

interface VendorPerformanceTabProps {
  vendor: VendorDetail;
}

export const VendorPerformanceTab: React.FC<VendorPerformanceTabProps> = ({
  vendor,
}) => {
  const { performance, statistics } = vendor;

  return (
    <div className="vendor-performance">
      <div className="info-section">
        <h4>Performance Metrics</h4>
        <div className="performance-grid">
          <div className="performance-card">
            <span className="performance-value">{performance.avgResponseTime}</span>
            <span className="performance-label">Avg Response Time</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">{performance.completionRate}</span>
            <span className="performance-label">Completion Rate</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">{performance.customerRating}</span>
            <span className="performance-label">Customer Rating</span>
          </div>
          <div className="performance-card">
            <span className="performance-value">{performance.repeatRate}</span>
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
              <div className="info-value">{statistics.totalRevenue}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-task"></i>
            <div className="info-content">
              <div className="info-label">Total Projects</div>
              <div className="info-value">{statistics.totalProjects}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-time-five"></i>
            <div className="info-content">
              <div className="info-label">Active Projects</div>
              <div className="info-value">{statistics.activeProjects}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-check-double"></i>
            <div className="info-content">
              <div className="info-label">On-Time Rate</div>
              <div className="info-value">{statistics.onTimeRate}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-timer"></i>
            <div className="info-content">
              <div className="info-label">Response Time</div>
              <div className="info-value">{statistics.responseTime}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-repeat"></i>
            <div className="info-content">
              <div className="info-label">Repeat Rate</div>
              <div className="info-value">{statistics.repeatRate}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Performance Trends</h4>
        <div className="performance-trend">
          <p className="trend-description">
            This vendor maintains excellent performance metrics with consistent delivery 
            and high customer satisfaction ratings. Response times are well below average, 
            and the repeat customer rate indicates strong client relationships.
          </p>
        </div>
      </div>
    </div>
  );
};

VendorPerformanceTab.displayName = 'VendorPerformanceTab';