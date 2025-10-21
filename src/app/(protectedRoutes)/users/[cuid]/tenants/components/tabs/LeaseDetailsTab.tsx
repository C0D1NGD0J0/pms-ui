import React from "react";

interface LeaseDetailsTabProps {
  tenant: any;
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
    }).format(amount || 0);
  };

  // Extract active leases from nested tenantInfo
  const activeLeases = tenant.tenantInfo?.activeLeases || [];
  const hasActiveLease = activeLeases.length > 0;

  // If no active lease, show informational message
  if (!hasActiveLease) {
    return (
      <div className="user-detail-tab">
        <div className="detail-empty-state">
          <i className="bx bx-info-circle"></i>
          <h3>No Active Lease</h3>
          <p>
            This tenant does not have any active lease information at this time.
          </p>
          <p>
            Lease details will be available once the lease management system is
            implemented and leases are created.
          </p>
        </div>
      </div>
    );
  }

  // For now, show basic info about active leases
  // Full lease details will come from Lease entity once implemented
  const activeLease = activeLeases[0];

  const leaseBasicInfo = [
    { label: "Lease Status", value: <span className="badge success">Active</span> },
    {
      label: "Rent Status",
      value: (
        <span
          className={`badge ${
            tenant.tenantMetrics?.currentRentStatus === "current"
              ? "success"
              : "warning"
          }`}
        >
          {tenant.tenantMetrics?.currentRentStatus
            ?.charAt(0)
            .toUpperCase() +
            tenant.tenantMetrics?.currentRentStatus?.slice(1).replace("_", " ") ||
            "Unknown"}
        </span>
      ),
    },
    {
      label: "Lease ID",
      value: activeLease?.leaseId || "N/A",
    },
    {
      label: "Confirmed",
      value: activeLease?.confirmed ? "Yes" : "No",
    },
    {
      label: "Confirmed Date",
      value: formatDate(activeLease?.confirmedDate),
    },
    {
      label: "Days in Current Lease",
      value: `${tenant.tenantMetrics?.daysCurrentLease || 0} days`,
    },
  ];

  const paymentInfo = [
    {
      label: "Total Rent Paid",
      value: formatCurrency(tenant.tenantMetrics?.totalRentPaid || 0),
    },
    {
      label: "On-Time Payment Rate",
      value: `${tenant.tenantMetrics?.onTimePaymentRate || 0}%`,
    },
    {
      label: "Average Payment Delay",
      value: `${tenant.tenantMetrics?.averagePaymentDelay || 0} days`,
    },
  ];

  return (
    <div className="user-detail-tab">
      <h3 className="detail-section-title">Active Lease Information</h3>

      <div className="metrics-grid">
        {leaseBasicInfo.map((info, index) => (
          <div key={index} className="metric-card">
            <span className="metric-value">{info.value}</span>
            <span className="metric-label">{info.label}</span>
          </div>
        ))}
      </div>

      <h3 className="detail-section-title">Payment Information</h3>

      <div className="metrics-grid cols-3">
        {paymentInfo.map((info, index) => (
          <div key={index} className="metric-card">
            <span className="metric-value">{info.value}</span>
            <span className="metric-label">{info.label}</span>
          </div>
        ))}
      </div>

      {tenant.tenantInfo?.leaseHistory &&
        tenant.tenantInfo.leaseHistory.length > 0 && (
          <>
            <h3 className="detail-section-title">Lease History</h3>
            <div className="metrics-grid">
              {tenant.tenantInfo.leaseHistory.map(
                (lease: any, index: number) => (
                  <div key={index} className="metric-card">
                    <span className="metric-value">
                      {lease.propertyName}
                    </span>
                    <span className="metric-label">
                      Unit {lease.unitNumber} • {lease.status}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "0.25rem",
                      }}
                    >
                      {formatDate(lease.leaseStart)} - {formatDate(lease.leaseEnd)}
                    </span>
                  </div>
                )
              )}
            </div>
          </>
        )}

      <div className="detail-info-box">
        <i className="bx bx-info-circle"></i>
        <strong>Note:</strong> Full lease details including property information,
        unit details, lease dates, rent amount, and lease documents will be
        available once the lease management system is implemented.
      </div>
    </div>
  );
};

LeaseDetailsTab.displayName = "LeaseDetailsTab";
