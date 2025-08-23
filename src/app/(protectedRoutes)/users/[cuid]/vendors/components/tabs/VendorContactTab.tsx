import React from "react";
import { VendorDetailResponse } from "@interfaces/user.interface";

interface VendorContactTabProps {
  vendor: VendorDetailResponse;
}

export const VendorContactTab: React.FC<VendorContactTabProps> = ({
  vendor,
}) => {
  return (
    <div className="employee-contact">
      <h3 style={{ marginBottom: '1.5rem', color: 'hsl(194, 66%, 24%)' }}>
        Contact Information
      </h3>
      
      <div className="contact-grid">
        <div className="contact-card">
          <h4>Primary Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <span>{vendor.vendorInfo?.contactPerson?.name || vendor.profile.fullName}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>
              {vendor.profile.phoneNumber || 
               vendor.profile.contact?.phone || 
               vendor.vendorInfo?.contactPerson?.phone || 'N/A'}
            </span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>
              {vendor.profile.email || 
               vendor.profile.contact?.email || 
               vendor.vendorInfo?.contactPerson?.email || 'N/A'}
            </span>
          </div>
          <div className="contact-item">
            <i className="bx bx-briefcase"></i>
            <span>{vendor.vendorInfo?.contactPerson?.jobTitle || 'Owner/Manager'}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Business Information</h4>
          <div className="contact-item">
            <i className="bx bx-map"></i>
            <span>{vendor.vendorInfo?.businessAddress || 'Address not provided'}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-city"></i>
            <span>{vendor.vendorInfo?.serviceAreas?.baseLocation || 'Service area not specified'}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <span>{vendor.vendorInfo?.businessHours || 'Contact for hours'}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Insurance & Legal</h4>
          <div className="contact-item">
            <i className="bx bx-shield"></i>
            <span>
              Provider: {vendor.vendorInfo?.insuranceInfo?.provider || 'Not provided'}
            </span>
          </div>
          <div className="contact-item">
            <i className="bx bx-file-blank"></i>
            <span>
              Policy: {vendor.vendorInfo?.insuranceInfo?.policyNumber || 'Not provided'}
            </span>
          </div>
          <div className="contact-item">
            <i className="bx bx-calendar"></i>
            <span>
              Expires: {vendor.vendorInfo?.insuranceInfo?.expirationDate 
                ? new Date(vendor.vendorInfo.insuranceInfo.expirationDate).toLocaleDateString()
                : 'Not provided'}
            </span>
          </div>
          <div className="contact-item">
            <i className="bx bx-id-card"></i>
            <span>
              Registration: {vendor.vendorInfo?.registrationNumber || 'Not provided'}
            </span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Account Manager</h4>
          <div className="contact-item">
            <i className="bx bx-user-circle"></i>
            <span>Account Manager</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>Contact main office</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>accounts@company.com</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <span>Response: {vendor.vendorInfo?.stats?.responseTime || 'Varies'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorContactTab.displayName = 'VendorContactTab';