import React from "react";
import { InsightCard } from "@components/Cards";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorOverviewTabProps {
  vendor: VendorDetailResponse;
}

export const VendorOverviewTab: React.FC<VendorOverviewTabProps> = ({
  vendor,
}) => {
  const vendorInfo = vendor.vendorInfo;

  return (
    <div className="overview-tab">
      <div className="info-section">
        <h4>Vendor Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-id-card"></i>
            <div className="info-content">
              <div className="info-label">Vendor ID</div>
              <div className="info-value">{vendorInfo?.registrationNumber || 'N/A'}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-calendar"></i>
            <div className="info-content">
              <div className="info-label">Years in Business</div>
              <div className="info-value">
                {vendorInfo?.yearsInBusiness ? `${vendorInfo.yearsInBusiness} years` : 'N/A'}
              </div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-briefcase"></i>
            <div className="info-content">
              <div className="info-label">Business Type</div>
              <div className="info-value">{vendorInfo?.businessType || 'N/A'}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-user-check"></i>
            <div className="info-content">
              <div className="info-label">Account Manager</div>
              <div className="info-value">{vendorInfo?.contactPerson?.name || 'N/A'}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-buildings"></i>
            <div className="info-content">
              <div className="info-label">Company</div>
              <div className="info-value">{vendorInfo?.companyName || 'N/A'}</div>
            </div>
          </div>

          <div className="info-item">
            <i className="bx bx-category-alt"></i>
            <div className="info-content">
              <div className="info-label">Position</div>
              <div className="info-value">{vendorInfo?.businessType || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h4>Performance Statistics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <InsightCard
            title="Completed Jobs"
            value={vendorInfo?.stats?.completedJobs || 0}
            icon={<i className="bx bx-task"></i>}
          />
          <InsightCard
            title="Active Jobs"
            value={vendorInfo?.stats?.activeJobs || 0}
            icon={<i className="bx bx-loader"></i>}
          />
          <InsightCard
            title="Rating"
            value={vendorInfo?.stats?.rating || 'N/A'}
            icon={<i className="bx bx-star"></i>}
          />
          <InsightCard
            title="Response Time"
            value={vendorInfo?.stats?.responseTime || 'N/A'}
            icon={<i className="bx bx-time-five"></i>}
          />
        </div>
      </div>

      {vendorInfo?.tags && vendorInfo.tags.length > 0 && (
        <div className="info-section">
          <h4>Skills & Specializations</h4>
          <div className="skills-container">
            {vendorInfo.tags.map((tag, index) => (
              <span key={index} className="skill-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="info-section">
        <h4>About</h4>
        <div className="about-section">
          <p>
            {vendor.profile.about || 
            `${vendorInfo?.companyName || 'This vendor'} specializes in ${vendorInfo?.businessType?.toLowerCase() || 'various services'} 
            with ${vendorInfo?.yearsInBusiness || 'several'} years of experience in the industry.`}
          </p>
        </div>
      </div>
    </div>
  );
};

VendorOverviewTab.displayName = "VendorOverviewTab";