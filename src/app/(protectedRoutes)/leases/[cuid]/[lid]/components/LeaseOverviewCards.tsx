import React from "react";
import { InsightCard } from "@components/Cards";

interface LeaseOverviewCardsProps {
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
}

export const LeaseOverviewCards: React.FC<LeaseOverviewCardsProps> = ({
  startDate,
  endDate,
  monthlyRent,
  securityDeposit,
}) => {
  return (
    <div className="insights">
      <InsightCard
        title="LEASE START"
        value={startDate}
        icon={<i className="bx bx-calendar"></i>}
        description="6 months ago"
      />
      <InsightCard
        title="LEASE END"
        value={endDate}
        icon={<i className="bx bx-calendar-x"></i>}
        description="6 months remaining"
      />
      <InsightCard
        title="MONTHLY RENT"
        value={`$${monthlyRent.toLocaleString()}`}
        icon={<i className="bx bx-dollar-circle"></i>}
        description="Due on 1st of month"
      />
      <InsightCard
        title="SECURITY DEPOSIT"
        value={`$${securityDeposit.toLocaleString()}`}
        icon={<i className="bx bx-shield"></i>}
        description="1.5x monthly rent"
      />
    </div>
  );
};
