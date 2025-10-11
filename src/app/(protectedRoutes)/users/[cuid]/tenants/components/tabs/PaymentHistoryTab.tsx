import React from "react";
import { TableColumn, Table } from "@components/Table";
import { ITenantDetailInfo } from "@interfaces/user.interface";

interface PaymentRecord {
  id: string;
  month: string;
  amount: number;
  status: string;
  paidDate: string;
  dueDate: string;
}

interface PaymentHistoryTabProps {
  tenant: ITenantDetailInfo & { profile: any };
}

export const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({
  tenant,
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const paymentHistory: PaymentRecord[] = tenant.paymentHistory || [];

  // Calculate summary stats
  const totalPaid = paymentHistory
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const paidOnTime = paymentHistory.filter((p) => {
    if (p.status !== "paid") return false;
    return new Date(p.paidDate) <= new Date(p.dueDate);
  }).length;
  const onTimeRate =
    paymentHistory.length > 0
      ? Math.round((paidOnTime / paymentHistory.length) * 100)
      : 0;

  const paymentColumns: TableColumn<PaymentRecord>[] = [
    {
      title: "Period",
      dataIndex: "month",
      render: (month: string) => <strong>{month}</strong>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount: number) => (
        <span className="price">{formatCurrency(amount)}</span>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Paid Date",
      dataIndex: "paidDate",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record) => {
        const statusConfig: Record<string, { className: string; label: string }> = {
          paid: { className: "success", label: "Paid" },
          overdue: { className: "danger", label: "Overdue" },
          pending: { className: "warning", label: "Pending" },
        };

        // Check if paid late
        let config = statusConfig[status] || { className: "default", label: status };

        if (
          status === "paid" &&
          new Date(record.paidDate) > new Date(record.dueDate)
        ) {
          config = { className: "warning", label: "Paid Late" };
        }

        return <span className={`badge ${config.className}`}>{config.label}</span>;
      },
    },
  ];

  const paymentMetrics = [
    { label: "Total Paid", value: formatCurrency(totalPaid) },
    { label: "Total Payments", value: paymentHistory.length.toString() },
    { label: "On-Time Rate", value: `${onTimeRate}%` },
    { label: "Monthly Rent", value: formatCurrency(tenant.leaseInfo.monthlyRent) },
  ];

  return (
    <div className="employee-performance">
      <h3 style={{ marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Payment Summary
      </h3>
      <div className="performance-grid">
        {paymentMetrics.map((metric, index) => (
          <div key={index} className="performance-card">
            <span className="performance-value">{metric.value}</span>
            <span className="performance-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: "2rem", marginBottom: "1.5rem", color: "hsl(194, 66%, 24%)" }}>
        Payment History
      </h3>
      {paymentHistory.length > 0 ? (
        <Table
          columns={paymentColumns}
          dataSource={paymentHistory}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
      ) : (
        <div className="empty-state">
          <i
            className="bx bx-dollar"
            style={{ fontSize: "48px", color: "#ccc" }}
          ></i>
          <p>No payment history available</p>
        </div>
      )}
    </div>
  );
};

PaymentHistoryTab.displayName = "PaymentHistoryTab";
