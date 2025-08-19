import React from "react";

import { VendorDetail } from "../../hooks/useGetVendor";

interface VendorContactTabProps {
  vendor: VendorDetail;
}

export const VendorContactTab: React.FC<VendorContactTabProps> = ({
  vendor,
}) => {
  const { contact, personalInfo } = vendor;

  return (
    <div className="vendor-contact">
      <div className="contact-grid">
        <div className="contact-card">
          <h4>Primary Contact</h4>
          <div className="contact-item">
            <i className="bx bx-user"></i>
            <div className="contact-info">
              <div className="contact-label">Name</div>
              <div className="contact-value">{contact.primary.name}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <div className="contact-info">
              <div className="contact-label">Phone</div>
              <div className="contact-value">{contact.primary.phone}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <div className="contact-info">
              <div className="contact-label">Email</div>
              <div className="contact-value">{contact.primary.email}</div>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <h4>Office Information</h4>
          <div className="contact-item">
            <i className="bx bx-map"></i>
            <div className="contact-info">
              <div className="contact-label">Address</div>
              <div className="contact-value">{contact.office.address}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-map-pin"></i>
            <div className="contact-info">
              <div className="contact-label">City</div>
              <div className="contact-value">{contact.office.city}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-time"></i>
            <div className="contact-info">
              <div className="contact-label">Hours</div>
              <div className="contact-value">{contact.office.hours}</div>
            </div>
          </div>
        </div>

        <div className="contact-card">
          <h4>Emergency Contact</h4>
          <div className="contact-item">
            <i className="bx bx-phone-call"></i>
            <div className="contact-info">
              <div className="contact-label">24/7 Emergency Line</div>
              <div className="contact-value">{personalInfo.phoneNumber}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope-open"></i>
            <div className="contact-info">
              <div className="contact-label">Emergency Email</div>
              <div className="contact-value">{personalInfo.email}</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <div className="contact-info">
              <div className="contact-label">Response Time</div>
              <div className="contact-value">Within 1 hour</div>
            </div>
          </div>
          <div className="contact-item">
            <i className="bx bx-calendar-check"></i>
            <div className="contact-info">
              <div className="contact-label">Availability</div>
              <div className="contact-value">24/7 for emergencies</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

VendorContactTab.displayName = 'VendorContactTab';