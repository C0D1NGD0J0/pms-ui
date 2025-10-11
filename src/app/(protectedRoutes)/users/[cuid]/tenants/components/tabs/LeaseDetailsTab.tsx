import React from "react";
import { ITenantDetailInfo } from "@interfaces/user.interface";

interface LeaseDetailsTabProps {
  tenant: ITenantDetailInfo & { profile: any };
}

export const LeaseDetailsTab: React.FC<LeaseDetailsTabProps> = ({ tenant }) => {
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

  const calculateLeaseDuration = () => {
    if (!tenant.leaseInfo.startDate || !tenant.leaseInfo.endDate) return "N/A";
    const start = new Date(tenant.leaseInfo.startDate);
    const end = new Date(tenant.leaseInfo.endDate);
    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return `${months} months`;
  };

  const calculateDaysRemaining = () => {
    if (!tenant.leaseInfo.endDate) return "N/A";
    const end = new Date(tenant.leaseInfo.endDate);
    const today = new Date();
    const days = Math.ceil(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? `${days} days` : "Expired";
  };

  const getLeaseStatusBadge = () => {
    const status = tenant.leaseInfo.status;
    return (
      <span className={`badge ${status === "active" ? "success" : "warning"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getRentStatusBadge = () => {
    const status = tenant.rentStatus;
    return (
      <span className={`badge ${status === "current" ? "success" : "warning"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const leaseMetrics = [
    { label: "Lease Status", value: getLeaseStatusBadge() },
    { label: "Rent Status", value: getRentStatusBadge() },
    { label: "Lease Duration", value: calculateLeaseDuration() },
    { label: "Days Remaining", value: calculateDaysRemaining() },
    {
      label: "Lease Start Date",
      value: formatDate(tenant.leaseInfo.startDate),
    },
    { label: "Lease End Date", value: formatDate(tenant.leaseInfo.endDate) },
    {
      label: "Monthly Rent",
      value: formatCurrency(tenant.leaseInfo.monthlyRent),
    },
    {
      label: "Annual Rent",
      value: formatCurrency(tenant.leaseInfo.monthlyRent * 12),
    },
  ];

  const propertyDetails = [
    { label: "Property Name", value: tenant.unit.propertyName },
    { label: "Unit Number", value: tenant.unit.unitNumber },
    { label: "Full Address", value: tenant.unit.address },
  ];

  return (
    <div className="employee-performance">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Lease Information
      </h3>

      <div className="performance-grid">
        {leaseMetrics.map((metric, index) => (
          <div key={index} className="performance-card">
            <span className="performance-value">{metric.value}</span>
            <span className="performance-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <h3
        style={{
          marginTop: "2rem",
          marginBottom: "1.5rem",
          color: "hsl(194, 66%, 24%)",
        }}
      >
        Property & Unit Details
      </h3>

      <div
        className="performance-grid"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {propertyDetails.map((detail, index) => (
          <div key={index} className="performance-card">
            <span className="performance-value">{detail.value}</span>
            <span className="performance-label">{detail.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

LeaseDetailsTab.displayName = "LeaseDetailsTab";
