import React from "react";
import { TableColumn, Table } from "@components/Table";

interface PaymentRecord {
  date: Date;
  amount: number;
  type: "rent" | "fee" | "deposit";
  status: "paid" | "late" | "pending";
  dueDate: Date;
}

interface PaymentHistoryTabProps {
  tenant: any;
}

export const PaymentHistoryTab: React.FC<PaymentHistoryTabProps> = ({
  tenant,
}) => {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
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

  // Access payment history from nested tenantInfo
  const paymentHistory: PaymentRecord[] =
    tenant.tenantInfo?.paymentHistory || [];

  // Calculate summary stats from tenant metrics and payment history
  const totalPaid = tenant.tenantMetrics?.totalRentPaid || 0;
  const onTimeRate = tenant.tenantMetrics?.onTimePaymentRate || 0;
  const avgDelay = tenant.tenantMetrics?.averagePaymentDelay || 0;

  const paymentColumns: TableColumn<PaymentRecord>[] = [
    {
      title: "Date",
      dataIndex: "date",
      render: (date: Date) => <strong>{formatDate(date)}</strong>,
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => (
        <span style={{ textTransform: "capitalize" }}>{type}</span>
      ),
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
      render: (date: Date) => formatDate(date),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const statusConfig: Record<
          string,
          { className: string; label: string }
        > = {
          paid: { className: "success", label: "Paid" },
          late: { className: "warning", label: "Paid Late" },
          pending: { className: "warning", label: "Pending" },
        };

        const config = statusConfig[status] || {
          className: "default",
          label: status,
        };

        return (
          <span className={`badge ${config.className}`}>{config.label}</span>
        );
      },
    },
  ];

  const paymentMetrics = [
    { label: "Total Paid", value: formatCurrency(totalPaid) },
    { label: "Total Payments", value: paymentHistory.length.toString() },
    { label: "On-Time Rate", value: `${onTimeRate}%` },
    { label: "Avg Payment Delay", value: `${avgDelay} days` },
  ];

  return (
    <div className="user-detail-tab">
      <h3 className="detail-section-title">Payment Summary</h3>
      <div className="metrics-grid">
        {paymentMetrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <span className="metric-value">{metric.value}</span>
            <span className="metric-label">{metric.label}</span>
          </div>
        ))}
      </div>

      <h3 className="detail-section-title">Payment History</h3>
      {paymentHistory.length > 0 ? (
        <Table
          columns={paymentColumns}
          dataSource={paymentHistory}
          rowKey="id"
          pagination={false}
          tableVariant="default"
        />
      ) : (
        <div className="detail-empty-state">
          <i className="bx bx-dollar"></i>
          <p>No payment history available</p>
          <p>
            Payment records will appear here once the payment system is
            integrated.
          </p>
        </div>
      )}
    </div>
  );
};

PaymentHistoryTab.displayName = "PaymentHistoryTab";
