import React from "react";
import { formatCurrency } from "@src/utils";
import { LeaseFinancialSummary } from "@src/interfaces/lease.interface";

interface Payment {
  date: string;
  method: string;
  amount: string;
  status: string;
}

interface FinancialTabProps {
  financialSummary: LeaseFinancialSummary;
  paymentHistory?: Payment[];
}

export const FinancialTab: React.FC<FinancialTabProps> = ({
  financialSummary,
  paymentHistory = [],
}) => {
  const currencyCode = financialSummary.currency || "USD";

  const lateFeeDisplay =
    financialSummary.lateFeeType === "fixed"
      ? `${formatCurrency(financialSummary.lateFeeAmount || 0, currencyCode)} after ${
          financialSummary.lateFeeDays || 0
        } days`
      : `${financialSummary.lateFeeAmount || 0}% after ${
          financialSummary.lateFeeDays || 0
        } days`;

  const nextPaymentDisplay = financialSummary.nextPaymentDate
    ? new Date(financialSummary.nextPaymentDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const lastPaymentDisplay = financialSummary.lastPaymentDate
    ? new Date(financialSummary.lastPaymentDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "No payments yet";

  const rentDetails = [
    {
      label: "Monthly Rent",
      value: formatCurrency(financialSummary.monthlyRentRaw, currencyCode),
      highlight: true,
    },
    {
      label: "Security Deposit",
      value: formatCurrency(financialSummary.securityDepositRaw, currencyCode),
    },
    {
      label: "Rent Due Date",
      value: `${financialSummary.rentDueDay}${getDaySuffix(
        financialSummary.rentDueDay
      )} of each month`,
    },
    {
      label: "Grace Period",
      value: `${financialSummary.lateFeeDays || 0} Days`,
    },
    { label: "Late Fee", value: lateFeeDisplay },
    {
      label: "Payment Method",
      value: financialSummary.acceptedPaymentMethod || "N/A",
    },
    { label: "Next Payment Due", value: nextPaymentDisplay },
    { label: "Last Payment", value: lastPaymentDisplay },
    {
      label: "Total Expected",
      value: formatCurrency(financialSummary.totalExpected, currencyCode),
    },
    { label: "Total Paid", value: formatCurrency(financialSummary.totalPaid, currencyCode) },
    { label: "Total Owed", value: formatCurrency(financialSummary.totalOwed, currencyCode) },
  ];

  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  return (
    <div>
      <h3 className="section-title">Rent Details</h3>
      <div className="info-grid">
        {rentDetails.map((item, idx) => (
          <div key={idx} className="info-row">
            <div className="info-label">{item.label}:</div>
            <div
              className={`info-value ${
                item.highlight ? "highlight-value" : ""
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {paymentHistory.length > 0 && (
        <>
          <h3 className="section-title">Payment History (Last 6 Months)</h3>
          <div className="payment-history">
            {paymentHistory.map((payment, idx) => (
              <div key={idx} className="payment-row">
                <div className="payment-row__info">
                  <div className="payment-row__icon">
                    <i className="bx bx-check"></i>
                  </div>
                  <div className="payment-row__details">
                    <div className="payment-row__date">{payment.date}</div>
                    <div className="payment-row__method">{payment.method}</div>
                  </div>
                </div>
                <div className="payment-row__amount">{payment.amount}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {paymentHistory.length === 0 && (
        <div className="empty-state">
          <p>No payment history available yet.</p>
        </div>
      )}
    </div>
  );
};
