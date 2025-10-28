import React from "react";

interface LeasePreviewContentProps {
  data: any;
  activeSection: string;
}

export const LeasePreviewContent: React.FC<LeasePreviewContentProps> = ({
  data,
  activeSection,
}) => (
  <div className="lease-preview">
    {/* Property Information */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-building"></i>
        <h3>Property Information</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Address</dt>
          <dd>{data?.property?.address || <em>Not selected</em>}</dd>
        </div>
        <div className="info-item">
          <dt>Unit</dt>
          <dd>{data?.property?.unit || <em>Not specified</em>}</dd>
        </div>
      </dl>
    </section>

    {/* Tenant Information */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-user"></i>
        <h3>Tenant Details</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Primary Tenant</dt>
          <dd>{data?.tenant?.name || <em>Not selected</em>}</dd>
        </div>
        <div className="info-item">
          <dt>Email</dt>
          <dd>{data?.tenant?.email || <em>Not provided</em>}</dd>
        </div>
      </dl>
    </section>

    {/* Financial Summary */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-dollar-circle"></i>
        <h3>Financial Summary</h3>
      </header>
      <dl className="info-list">
        <div className="info-item">
          <dt>Lease Period</dt>
          <dd>
            {data?.duration?.startDate ? (
              `${data.duration.startDate} - ${data.duration.endDate}`
            ) : (
              <em>Not set</em>
            )}
          </dd>
        </div>
        <div className="info-item">
          <dt>Monthly Rent</dt>
          <dd className="amount">${data?.fees?.monthlyRent || 0}</dd>
        </div>
        <div className="info-item">
          <dt>Security Deposit</dt>
          <dd className="amount">${data?.fees?.securityDeposit || 0}</dd>
        </div>
      </dl>
    </section>

    {/* Progress Indicator */}
    <section className="preview-section">
      <header className="section-header">
        <i className="bx bx-check-circle"></i>
        <h3>Progress</h3>
      </header>
      <div className="progress-info">
        <div className="info-item">
          <dt>Current Section</dt>
          <dd className="current-section">
            {activeSection.replace(/-/g, " ").toUpperCase()}
          </dd>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: "17%" }}></div>
        </div>
        <span className="progress-text">1 of 6 sections</span>
      </div>
    </section>
  </div>
);
