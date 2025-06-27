import React from "react";
import { Table } from "@components/Table";
import { Button } from "@components/FormElements";

const paymentData = [
  {
    id: "1",
    date: "June 1, 2025",
    amount: "$2,500",
    type: "Rent",
    method: "Bank Transfer",
    status: "Paid",
    lateFees: "$0",
  },
  {
    id: "2",
    date: "May 1, 2025",
    amount: "$2,500",
    type: "Rent",
    method: "Bank Transfer",
    status: "Paid",
    lateFees: "$0",
  },
  {
    id: "3",
    date: "April 5, 2025",
    amount: "$2,575",
    type: "Rent",
    method: "Bank Transfer",
    status: "Paid",
    lateFees: "$75",
  },
  {
    id: "4",
    date: "March 1, 2025",
    amount: "$2,500",
    type: "Rent",
    method: "Bank Transfer",
    status: "Paid",
    lateFees: "$0",
  },
  {
    id: "5",
    date: "February 1, 2025",
    amount: "$2,500",
    type: "Rent",
    method: "Bank Transfer",
    status: "Paid",
    lateFees: "$0",
  },
];

const paymentColumns = [
  { title: "Date", dataIndex: "date" },
  { title: "Amount", dataIndex: "amount" },
  { title: "Type", dataIndex: "type" },
  { title: "Method", dataIndex: "method" },
  { title: "Status", dataIndex: "status", isStatus: true },
  { title: "Late Fees", dataIndex: "lateFees" },
  {
    title: "Actions",
    dataIndex: "actions",
    render: () => <Button className="btn btn-sm btn-outline" label="Receipt" />,
  },
];

export function PaymentHistoryTab() {
  return (
    <div className="payment-log">
      <Table
        dataSource={paymentData}
        columns={paymentColumns}
        pagination={true}
      />
      <div
        className="form-actions"
        style={{ marginTop: "1rem", justifyContent: "flex-end" }}
      >
        <Button
          className="btn btn-primary"
          label="Record Payment"
          icon={<i className="bx bx-plus"></i>}
        />
      </div>
    </div>
  );
}
