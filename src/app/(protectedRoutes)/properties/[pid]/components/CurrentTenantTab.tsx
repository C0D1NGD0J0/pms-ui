import React from "react";
import Link from "next/link";
import { Button } from "@components/FormElements";
import { IPropertyDocument } from "@interfaces/property.interface";

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
  isMultiUnit?: boolean;
  unitsInfo?: {
    availableSpaces: number;
    maxAllowedUnits: number;
  } | null;
  tenant?: TenantData | null;
  property?: IPropertyDocument;
}

export function CurrentTenantTab({
  tenant,
  property,
  unitsInfo,
  isMultiUnit,
}: CurrentTenantTabProps) {
  if (!tenant && property) {
    const oocupanyStatus =
      property.unitInfo?.availableSpaces === 0 ? "Fully occupied" : "Vacant";
    return (
      <div className="tenant-info">
        <div className="user-info">
          <div className="tenant-avatar">
            <i className="bx bx-home" style={{ fontSize: "2rem" }}></i>
          </div>
          <div className="tenant-details">
            <h4>
              Property currently <span>{property.status}</span>
            </h4>
            <p>Occupancy status: {oocupanyStatus}</p>
            {isMultiUnit ? (
              <p>Total Units: {unitsInfo?.maxAllowedUnits}</p>
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <h5>Property Details</h5>
          <div
            className="property-features"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {property.specifications?.bedrooms > 0 && (
              <div className="feature-item">
                <i className="bx bx-bed"></i>
                <div>
                  <h5>Rooms</h5>
                  <span>{property.specifications.bedrooms}</span>
                </div>
              </div>
            )}
            {property.specifications?.bathrooms > 0 && (
              <div className="feature-item">
                <i className="bx bx-bath"></i>
                <div>
                  <h5>Bathrooms</h5>
                  <span>{property.specifications.bathrooms}</span>
                </div>
              </div>
            )}
            {property.specifications?.totalArea > 0 && (
              <div className="feature-item">
                <i className="bx bx-area-chart"></i>
                <div>
                  <h5>Square Feet</h5>
                  <span>{property.specifications.totalArea} sq ft</span>
                </div>
              </div>
            )}
            {property.fees?.rentalAmount &&
              parseFloat(property.fees.rentalAmount) > 0 && (
                <div className="feature-item">
                  <i className="bx bx-dollar-circle"></i>
                  <div>
                    <h5>Target Rent</h5>
                    <span>${property.fees.rentalAmount}/month</span>
                  </div>
                </div>
              )}
            {property.fees?.securityDeposit &&
              parseFloat(property.fees.securityDeposit) > 0 && (
                <div className="feature-item">
                  <i className="bx bx-shield"></i>
                  <div>
                    <h5>Security Deposit</h5>
                    <span>${property.fees.securityDeposit}</span>
                  </div>
                </div>
              )}
            <div className="feature-item">
              <i className="bx bx-building"></i>
              <div>
                <h5>Property Type</h5>
                <span style={{ textTransform: "capitalize" }}>
                  {property.propertyType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if no tenant and no property data
  if (!tenant) {
    return (
      <div className="tenant-info">
        <div className="user-info">
          <div className="tenant-avatar">
            <i className="bx bx-home" style={{ fontSize: "2rem" }}></i>
          </div>
          <div className="tenant-details">
            <h4>Property Currently Vacant</h4>
            <p>No tenant information available</p>
          </div>
        </div>
      </div>
    );
  }

  // tenant display logic
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
