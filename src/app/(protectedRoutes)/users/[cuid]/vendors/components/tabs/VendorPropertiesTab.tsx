import React from "react";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorPropertiesTabProps {
  vendor: VendorDetailResponse;
}

export const VendorPropertiesTab: React.FC<VendorPropertiesTabProps> = ({
  vendor,
}) => {
  const properties = vendor.properties || [];

  return (
    <div className="vendor-properties">
      <div className="properties-header">
        <h4>Properties Serviced</h4>
        <p className="properties-subtitle">
          Properties where this vendor has provided or is scheduled to provide services
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="properties-grid">
          {properties.map((property, index) => (
            <div key={property.id || index} className="property-card">
              <div className="property-header">
                <div className="property-title">
                  <i className="bx bx-building-house"></i>
                  <h5>{property.name || 'Property Name'}</h5>
                </div>
                <div className="property-status">
                  <span className={`status-badge ${property.status?.toLowerCase()}`}>
                    {property.status || 'Active'}
                  </span>
                </div>
              </div>
              
              <div className="property-details">
                <div className="property-info">
                  <i className="bx bx-map"></i>
                  <span>{property.address || 'Address not provided'}</span>
                </div>
                
                <div className="property-info">
                  <i className="bx bx-category"></i>
                  <span>{property.type || 'Property Type'}</span>
                </div>
                
                {property.units && (
                  <div className="property-info">
                    <i className="bx bx-home"></i>
                    <span>{property.units} units</span>
                  </div>
                )}
              </div>

              <div className="property-services">
                <h6>Services Provided:</h6>
                <div className="services-list">
                  {property.services?.map((service, idx) => (
                    <span key={idx} className="service-tag">
                      <i className="bx bx-wrench"></i>
                      {service}
                    </span>
                  )) || (
                    <span className="service-tag">
                      <i className="bx bx-wrench"></i>
                      General Maintenance
                    </span>
                  )}
                </div>
              </div>

              <div className="property-actions">
                <button className="btn btn-sm btn-outline">
                  <i className="bx bx-show"></i>
                  View Details
                </button>
                <button className="btn btn-sm btn-primary">
                  <i className="bx bx-task"></i>
                  View Work Orders
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="bx bx-building-house"></i>
          </div>
          <h5>No Properties Assigned</h5>
          <p>
            This vendor hasn&apos;t been assigned to any properties yet. 
            Properties will appear here once work orders are created.
          </p>
        </div>
      )}

      <div className="properties-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <i className="bx bx-building-house"></i>
            <div className="stat-content">
              <div className="stat-value">{properties.length}</div>
              <div className="stat-label">Total Properties</div>
            </div>
          </div>
          
          <div className="stat-item">
            <i className="bx bx-task"></i>
            <div className="stat-content">
              <div className="stat-value">
                {vendor.vendorInfo?.stats?.completedJobs || 0}
              </div>
              <div className="stat-label">Completed Jobs</div>
            </div>
          </div>
          
          <div className="stat-item">
            <i className="bx bx-time-five"></i>
            <div className="stat-content">
              <div className="stat-value">
                {vendor.vendorInfo?.stats?.activeJobs || 0}
              </div>
              <div className="stat-label">Active Jobs</div>
            </div>
          </div>
          
          <div className="stat-item">
            <i className="bx bx-star"></i>
            <div className="stat-content">
              <div className="stat-value">{vendor.vendorInfo?.stats?.rating || 'N/A'}</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorPropertiesTab.displayName = "VendorPropertiesTab";