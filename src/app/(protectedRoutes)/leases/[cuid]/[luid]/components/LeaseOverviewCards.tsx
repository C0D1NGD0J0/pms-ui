import React from "react";
import { InsightCard } from "@components/Cards";
import {
  DateDisplayFormat,
  getCurrencyInfo,
  formatDate,
  formatCurrency,
} from "@utils/index";

interface LeaseOverviewCardsProps {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  currency?: string;
  dateFormat?: DateDisplayFormat;
  rentDueDay?: number;
}

export const LeaseOverviewCards: React.FC<LeaseOverviewCardsProps> = ({
  startDate,
  endDate,
  monthlyRent,
  securityDeposit,
  currency = "USD",
  dateFormat = "shortMonth",
  rentDueDay = 1,
}) => {
  const currencyInfo = getCurrencyInfo(currency);
  const depositRatio = (securityDeposit / monthlyRent).toFixed(1);

  return (
    <div className="insights">
      <InsightCard
        title="LEASE START"
        value={formatDate(startDate, { displayFormat: dateFormat })}
        icon={<i className="bx bx-calendar"></i>}
        description="Commencement date"
      />
      <InsightCard
        title="LEASE END"
        value={formatDate(endDate, { displayFormat: dateFormat })}
        icon={<i className="bx bx-calendar-x"></i>}
        description="Expiration date"
      />
      <InsightCard
        title="MONTHLY RENT"
        value={formatCurrency(monthlyRent, currency)}
        icon={<i className={`bx ${currencyInfo.icon}`}></i>}
        description={`Due on ${rentDueDay}${
          rentDueDay === 1
            ? "st"
            : rentDueDay === 2
            ? "nd"
            : rentDueDay === 3
            ? "rd"
            : "th"
        } of month`}
      />
      <InsightCard
        title="SECURITY DEPOSIT"
        value={formatCurrency(securityDeposit, currency)}
        icon={<i className="bx bx-shield"></i>}
        description={`${depositRatio}x monthly rent`}
      />
    </div>
  );
};
