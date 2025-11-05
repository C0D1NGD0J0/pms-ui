import React from "react";
import { PaymentRecord, PaymentTable } from "@components/Property";

const paymentData: PaymentRecord[] = [
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

export function PaymentHistoryTab() {
  const handleRecordPayment = () => {
    console.log("Record new payment");
  };

  const handleDownloadReceipt = (paymentId: string) => {
    console.log("Download receipt for:", paymentId);
  };

  return (
    <PaymentTable
      viewType="landlord"
      data={paymentData}
      onRecordPayment={handleRecordPayment}
      onDownloadReceipt={handleDownloadReceipt}
    />
  );
}
