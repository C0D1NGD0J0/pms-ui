import React from "react";
import { Button } from "@components/FormElements";

export interface TenantData {
  name: string;
  avatar: string;
  lease: string;
  rentDue: string;
  contact: string;
  details: {
    tenantSince: string;
    occupants: string;
    paymentMethod: string;
    paymentHistory: string;
    securityDeposit: string;
    leaseRenewal: string;
  };
}

export interface CurrentTenantTabProps {
  tenant: TenantData;
}

export function CurrentTenantTab({ tenant }: CurrentTenantTabProps) {
  return (
    <div className="tenant-info">
      <div className="user-info">
        <div className="tenant-avatar">{tenant.avatar}</div>
        <div className="tenant-details">
          <h4>{tenant.name}</h4>
          <p>Lease: {tenant.lease}</p>
          <p>Rent Due: {tenant.rentDue}</p>
          <p>Contact: {tenant.contact}</p>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <h5>Tenant Details</h5>
        <div
          className="property-features"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          <div className="feature-item">
            <i className="bx bx-user-check"></i>
            <div>
              <h5>Tenant Since</h5>
              <span>{tenant.details.tenantSince}</span>
            </div>
          </div>
          <div className="feature-item">
            <i className="bx bx-group"></i>
            <div>
              <h5>Occupants</h5>
              <span>{tenant.details.occupants}</span>
            </div>
          </div>
          <div className="feature-item">
            <i className="bx bx-credit-card"></i>
            <div>
              <h5>Payment Method</h5>
              <span>{tenant.details.paymentMethod}</span>
            </div>
          </div>
          <div className="feature-item">
            <i className="bx bx-check-circle"></i>
            <div>
              <h5>Payment History</h5>
              <span className="badge success">
                {tenant.details.paymentHistory}
              </span>
            </div>
          </div>
          <div className="feature-item">
            <i className="bx bx-shield"></i>
            <div>
              <h5>Security Deposit</h5>
              <span>{tenant.details.securityDeposit}</span>
            </div>
          </div>
          <div className="feature-item">
            <i className="bx bx-calendar-exclamation"></i>
            <div>
              <h5>Lease Renewal</h5>
              <span>{tenant.details.leaseRenewal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop: "1.5rem" }}>
        <Button
          className="btn btn-outline"
          label="Message Tenant"
          icon={<i className="bx bx-envelope"></i>}
        />
        <Button
          className="btn btn-outline"
          label="View Lease"
          icon={<i className="bx bx-file"></i>}
        />
        <Button
          className="btn btn-primary"
          label="Renew Lease"
          icon={<i className="bx bx-calendar-edit"></i>}
        />
      </div>
    </div>
  );
}
