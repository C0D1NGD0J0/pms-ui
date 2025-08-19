import React from "react";
import { EmployeeTag } from "@components/Badge";

import { VendorDetail } from "../../hooks/useGetVendor";

interface VendorServicesTabProps {
  vendor: VendorDetail;
}

export const VendorServicesTab: React.FC<VendorServicesTabProps> = ({
  vendor,
}) => {
  const { services, vendorInfo } = vendor;

  return (
    <div className="vendor-services">
      <div className="info-section">
        <h4>Services Offered</h4>
        <div className="services-table">
          <div className="services-table-header">
            <div className="header-cell">Service</div>
            <div className="header-cell">Category</div>
            <div className="header-cell">Rate</div>
            <div className="header-cell">Availability</div>
            <div className="header-cell">Response Time</div>
          </div>
          {services.map((service) => (
            <div key={service.id} className="service-row">
              <div className="service-cell">
                <div className="service-info">
                  <i className={service.categoryIcon}></i>
                  <span className="service-name">{service.name}</span>
                </div>
              </div>
              <div className="service-cell">
                <EmployeeTag variant="permission" size="small">
                  {service.category}
                </EmployeeTag>
              </div>
              <div className="service-cell service-rate">{service.rate}</div>
              <div className="service-cell">{service.availability}</div>
              <div className="service-cell">{service.responseTime}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h4>Business Information</h4>
        <div className="info-grid">
          <div className="info-item">
            <i className="bx bx-buildings"></i>
            <div className="info-content">
              <div className="info-label">Business Type</div>
              <div className="info-value">{vendorInfo.businessType}</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-star"></i>
            <div className="info-content">
              <div className="info-label">Rating</div>
              <div className="info-value">{vendorInfo.rating}/5 stars</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-group"></i>
            <div className="info-content">
              <div className="info-label">Total Reviews</div>
              <div className="info-value">{vendorInfo.reviewCount} reviews</div>
            </div>
          </div>
          <div className="info-item">
            <i className="bx bx-check-circle"></i>
            <div className="info-content">
              <div className="info-label">Status</div>
              <div className="info-value">{vendorInfo.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorServicesTab.displayName = 'VendorServicesTab';