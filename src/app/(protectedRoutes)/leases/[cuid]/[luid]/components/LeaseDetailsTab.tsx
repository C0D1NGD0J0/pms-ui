import React from "react";
import { formatDate } from "@src/utils/dateFormatter";

interface LeaseDetailsTabProps {
  leaseData: any;
}

export const LeaseDetailsTab: React.FC<LeaseDetailsTabProps> = ({
  leaseData,
}) => {
  const infoItems = [
    { label: "Lease Number", value: leaseData.luid },
    { label: "Lease Type", value: leaseData.type },
    {
      label: "Start Date",
      value: formatDate(leaseData.duration.startDate, {
        displayFormat: "shortMonth",
      }),
    },
    {
      label: "End Date",
      value: formatDate(leaseData.duration.endDate, {
        displayFormat: "shortMonth",
      }),
    },
    {
      label: "Notice Period",
      value: leaseData.renewalOptions.noticePeriodDays,
    },
    {
      label: "Renewal Option",
      value: leaseData.renewalOptions.autoRenew
        ? "Auto-Renew"
        : "No Auto-Renew",
    },
    {
      label: "Signed Date",
      value: leaseData.signatures.length
        ? leaseData.signatures[0].status
        : "Not Signed",
    },
    {
      label: "Move-in Date",
      value: formatDate(leaseData.duration.moveInDate, {
        displayFormat: "shortMonth",
      }),
    },
    {
      label: "Pets Allowed",
      value: leaseData.petPolicy.allowed
        ? `Allowed - ${leaseData.petPolicy.maxPets} Pets`
        : "Not Allowed",
    },
    { label: "Parking Spaces", value: leaseData.parkingSpaces || 0 },
  ];

  return (
    <div className="info-grid">
      {infoItems.map((item, idx) => (
        <div key={idx} className="info-row">
          <div className="info-label">{item.label}:</div>
          <div className="info-value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};
