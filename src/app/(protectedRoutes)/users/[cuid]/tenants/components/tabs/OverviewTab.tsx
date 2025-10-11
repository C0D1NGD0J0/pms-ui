import React from "react";
import { ITenantDetailInfo } from "@interfaces/user.interface";

interface OverviewTabProps {
  tenant: ITenantDetailInfo & { profile: any };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ tenant }) => {
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="overview-tab">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Tenant Information
      </h3>
      <div className="info-grid" style={{ marginBottom: "2rem" }}>
        <div className="info-item">
          <i className="bx bx-user"></i>
          <div className="info-content">
            <div className="info-label">Full Name</div>
            <div className="info-value">{tenant.profile.fullName}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-envelope"></i>
          <div className="info-content">
            <div className="info-label">Email</div>
            <div className="info-value">{tenant.profile.email}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-phone"></i>
          <div className="info-content">
            <div className="info-label">Phone Number</div>
            <div className="info-value">{tenant.profile.phoneNumber}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-home"></i>
          <div className="info-content">
            <div className="info-label">Unit Number</div>
            <div className="info-value">{tenant.unit.unitNumber}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-buildings"></i>
          <div className="info-content">
            <div className="info-label">Property</div>
            <div className="info-value">{tenant.unit.propertyName}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-check-circle"></i>
          <div className="info-content">
            <div className="info-label">Lease Status</div>
            <div className="info-value">
              <span
                className={`badge ${
                  tenant.leaseInfo.status === "active" ? "success" : "warning"
                }`}
              >
                {tenant.leaseInfo.status.charAt(0).toUpperCase() +
                  tenant.leaseInfo.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-dollar"></i>
          <div className="info-content">
            <div className="info-label">Monthly Rent</div>
            <div className="info-value price">
              {formatCurrency(tenant.leaseInfo.monthlyRent)}
            </div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-dollar-circle"></i>
          <div className="info-content">
            <div className="info-label">Rent Status</div>
            <div className="info-value">
              <span
                className={`badge ${
                  tenant.rentStatus === "current" ? "success" : "warning"
                }`}
              >
                {tenant.rentStatus.charAt(0).toUpperCase() +
                  tenant.rentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-calendar"></i>
          <div className="info-content">
            <div className="info-label">Lease Start Date</div>
            <div className="info-value">{formatDate(tenant.leaseInfo.startDate)}</div>
          </div>
        </div>

        <div className="info-item">
          <i className="bx bx-calendar-check"></i>
          <div className="info-content">
            <div className="info-label">Lease End Date</div>
            <div className="info-value">{formatDate(tenant.leaseInfo.endDate)}</div>
          </div>
        </div>
      </div>

      {tenant.profile.about && (
        <>
          <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
            About
          </h3>
          <p style={{ marginBottom: "2rem" }}>{tenant.profile.about}</p>
        </>
      )}
    </div>
  );
};

OverviewTab.displayName = "OverviewTab";
