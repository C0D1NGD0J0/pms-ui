import React from "react";
import { formatDate } from "@utils/dateFormatter";
import { formatCurrency } from "@utils/currencyMapper";
import { LeaseDetailData } from "@interfaces/lease.interface";

interface RenewalSummaryCardProps {
  renewalLease: LeaseDetailData;
  newRent?: number;
  newStartDate?: string;
  newEndDate?: string;
}

export const RenewalSummaryCard = React.memo(
  ({
    renewalLease,
    newRent,
    newStartDate,
    newEndDate,
  }: RenewalSummaryCardProps) => {
    const rentChange = newRent ? newRent - renewalLease.fees.monthlyRent : 0;
    const rentChangePercent = renewalLease.fees.monthlyRent
      ? ((rentChange / renewalLease.fees.monthlyRent) * 100).toFixed(1)
      : 0;

    const currency = renewalLease.fees.currency || "USD";

    const propertyAddress =
      typeof renewalLease.property.address === "string"
        ? renewalLease.property.address
        : renewalLease.property.address?.fullAddress || "N/A";

    return (
      <div className="banner banner-warning">
        <div className="banner-content">
          <div className="banner-content__icon">
            <i className="bx bx-info-circle"></i>
          </div>
          <div className="banner-content__info">
            <h3 className="title" style={{ marginBottom: "1.5rem" }}>
              Current Lease Summary
            </h3>
            <div className="summary-row">
              <span className="summary-item">
                <i className="bx bx-user"></i>
                <strong>Tenant:</strong>{" "}
                {renewalLease.tenant?.fullname || "N/A"}
              </span>
              <span className="summary-item">
                <i className="bx bx-home"></i>
                <strong>Property:</strong> {propertyAddress}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-item">
                <i className="bx bx-calendar"></i>
                <strong>Current Term:</strong>{" "}
                {formatDate(renewalLease.duration.startDate as string, {
                  displayFormat: "shortMonth",
                })}{" "}
                -{" "}
                {formatDate(renewalLease.duration.endDate as string, {
                  displayFormat: "shortMonth",
                })}
              </span>
              {newStartDate && newEndDate && (
                <span className="summary-item summary-item--highlight">
                  <i className="bx bx-calendar-check"></i>
                  <strong>New Term:</strong>{" "}
                  {formatDate(newStartDate, { displayFormat: "shortMonth" })} -{" "}
                  {formatDate(newEndDate, { displayFormat: "shortMonth" })}
                </span>
              )}
            </div>
            <div className="summary-row">
              <span className="summary-item">
                <i className="bx bx-dollar"></i>
                <strong>Monthly Rent:</strong>{" "}
                {formatCurrency(renewalLease.fees.monthlyRent, currency)}
              </span>
              {newRent && newRent !== renewalLease.fees.monthlyRent && (
                <span
                  className={`summary-item ${
                    rentChange > 0
                      ? "summary-item--increase"
                      : "summary-item--decrease"
                  }`}
                >
                  <i className="bx bx-dollar-circle"></i>
                  <strong>New Rent:</strong> {formatCurrency(newRent, currency)}
                  {rentChange > 0 ? (
                    <span>
                      {" "}
                      (+{formatCurrency(rentChange, currency)} / +
                      {rentChangePercent}%)
                    </span>
                  ) : (
                    <span>
                      {" "}
                      ({formatCurrency(rentChange, currency)} /{" "}
                      {rentChangePercent}%)
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="summary-row">
              <span className="summary-item">
                <i className="bx bx-shield"></i>
                <strong>Security Deposit:</strong>{" "}
                {formatCurrency(renewalLease.fees.securityDeposit, currency)}
              </span>
              <span className="summary-item">
                <i className="bx bx-file"></i>
                <strong>Lease Type:</strong>{" "}
                {renewalLease.type.replace("_", " ").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RenewalSummaryCard.displayName = "RenewalSummaryCard";
