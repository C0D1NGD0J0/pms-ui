import React from "react";

interface Payment {
  date: string;
  method: string;
  amount: string;
  status: string;
}

interface FinancialTabProps {
  paymentHistory: Payment[];
}

export const FinancialTab: React.FC<FinancialTabProps> = ({ paymentHistory }) => {
  const rentDetails = [
    { label: "Base Rent", value: "$2,200" },
    { label: "Pet Fee", value: "$50/month" },
    { label: "Parking Fee", value: "$100/month (2 spaces)" },
    { label: "Storage Unit", value: "$100/month" },
    { label: "Total Monthly Rent", value: "$2,450", highlight: true },
    { label: "Rent Due Date", value: "1st of each month" },
    { label: "Grace Period", value: "5 Days" },
    { label: "Late Fee", value: "$75 after grace period" },
    { label: "Security Deposit", value: "$3,675" },
    { label: "Payment Method", value: "ACH Auto-pay" },
  ];

  return (
    <div>
      <h3 className="section-title">Rent Details</h3>
      <div className="info-grid">
        {rentDetails.map((item, idx) => (
          <div key={idx} className="info-item">
            <div className="info-item__label">{item.label}</div>
            <div className={`info-item__value ${item.highlight ? "highlight-value" : ""}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};
