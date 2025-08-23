import React from 'react';

interface ContactInfo {
  primary: {
    name: string;
    phone: string;
    email: string;
  };
  office: {
    address: string;
    city: string;
    hours: string;
  };
  emergency?: {
    name: string;
    phone: string;
    relationship: string;
  };
  manager: {
    name: string;
    phone: string;
    email: string;
    title: string;
  };
}

interface ContactTabProps {
  userType: 'employee' | 'vendor';
  contactInfo: ContactInfo;
}

export const ContactTab: React.FC<ContactTabProps> = ({
  userType,
  contactInfo
}) => {
  const getManagerTitle = () => {
    return userType === 'employee' ? 'Direct Manager' : 'Account Manager';
  };

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
            <span>{contactInfo.primary.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contactInfo.primary.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{contactInfo.primary.email}</span>
          </div>
        </div>

        <div className="contact-card">
          <h4>Office Information</h4>
          <div className="contact-item">
            <i className="bx bx-map"></i>
            <span>{contactInfo.office.address}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-city"></i>
            <span>{contactInfo.office.city}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-time-five"></i>
            <span>{contactInfo.office.hours}</span>
          </div>
        </div>

        {contactInfo.emergency && (
          <div className="contact-card">
            <h4>Emergency Contact</h4>
            <div className="contact-item">
              <i className="bx bx-user"></i>
              <span>{contactInfo.emergency.name}</span>
            </div>
            <div className="contact-item">
              <i className="bx bx-phone"></i>
              <span>{contactInfo.emergency.phone}</span>
            </div>
            <div className="contact-item">
              <i className="bx bx-info-circle"></i>
              <span>Relationship: {contactInfo.emergency.relationship}</span>
            </div>
          </div>
        )}

        <div className="contact-card">
          <h4>{getManagerTitle()}</h4>
          <div className="contact-item">
            <i className="bx bx-user-check"></i>
            <span>{contactInfo.manager.name}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-phone"></i>
            <span>{contactInfo.manager.phone}</span>
          </div>
          <div className="contact-item">
            <i className="bx bx-envelope"></i>
            <span>{contactInfo.manager.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};