import React from "react";
import { Button } from "@components/FormElements";
import { TableColumn, Table } from "@components/Table";

export interface PaymentRecord {
  id: string;
  date: string;
  amount: string;
  type: string;
  method: string;
  status: string;
  lateFees?: string;
}

export interface PaymentTableProps {
  viewType: "landlord" | "tenant";
  data: PaymentRecord[];
  onRecordPayment?: () => void;
  onMakePayment?: () => void;
  onDownloadReceipt?: (paymentId: string) => void;
  className?: string;
}

export function PaymentTable({
  viewType,
  data,
  onRecordPayment,
  onMakePayment,
  onDownloadReceipt,
  className = "",
}: PaymentTableProps) {
  // Define columns based on view type
  const getColumns = (): TableColumn<PaymentRecord>[] => {
    const baseColumns: TableColumn<PaymentRecord>[] = [
      { title: "Date", dataIndex: "date" },
      { title: "Amount", dataIndex: "amount" },
      { title: "Type", dataIndex: "type" },
      { title: "Method", dataIndex: "method" },
      { title: "Status", dataIndex: "status", isStatus: true },
    ];

    // Add landlord-specific columns
    if (viewType === "landlord") {
      baseColumns.push({ title: "Late Fees", dataIndex: "lateFees" });

      // Add landlord actions column
      baseColumns.push({
        title: "Actions",
        dataIndex: "actions",
        key: "actions",
        render: (_, record: PaymentRecord) => (
          <Button
            key={`action-${record.id}`}
            className="btn btn-sm btn-outline"
            label="Receipt"
            onClick={() => onDownloadReceipt?.(record.id)}
          />
        ),
      });
    } else {
      // Add tenant receipt column
      baseColumns.push({
        title: "Receipt",
        dataIndex: "actions",
        key: "receipt",
        render: (_, record: PaymentRecord) =>
          record.status === "Paid" ? (
            <Button
              key={`receipt-${record.id}`}
              className="btn btn-sm btn-outline"
              label="Download"
              icon={<i className="bx bx-download"></i>}
              onClick={() => onDownloadReceipt?.(record.id)}
            />
          ) : (
            <span key={`no-receipt-${record.id}`}>-</span>
          ),
      });
    }

    return baseColumns;
  };

  const getActionButton = () => {
    if (viewType === "landlord" && onRecordPayment) {
      return (
        <Button
          className="btn btn-primary"
          label="Record Payment"
          icon={<i className="bx bx-plus"></i>}
          onClick={onRecordPayment}
        />
      );
    } else if (viewType === "tenant" && onMakePayment) {
      return (
        <Button
          className="btn btn-primary"
          label="Make Payment"
          icon={<i className="bx bx-credit-card"></i>}
          onClick={onMakePayment}
        />
      );
    }
    return null;
  };

  return (
    <div className={`payment-log ${className}`}>
      <Table dataSource={data} columns={getColumns()} pagination={true} />
      {getActionButton() && (
        <div
          className="form-actions"
          style={{ marginTop: "1rem", justifyContent: "flex-end" }}
        >
          {getActionButton()}
        </div>
      )}
    </div>
  );
}
