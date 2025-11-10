import React from "react";

interface LeaseDetailsTabProps {
  leaseData: {
    luid: string;
    leaseType: string;
    startDate: string;
    endDate: string;
    duration: string;
    noticePeriod: string;
    renewalOption: string;
    signedDate: string;
    moveInDate: string;
    occupancyLimit: string;
    petsAllowed: string;
    parkingSpaces: string;
  };
}

export const LeaseDetailsTab: React.FC<LeaseDetailsTabProps> = ({ leaseData }) => {
  const infoItems = [
    { label: "Lease Number", value: leaseData.luid },
    { label: "Lease Type", value: leaseData.leaseType },
    { label: "Start Date", value: leaseData.startDate },
    { label: "End Date", value: leaseData.endDate },
    { label: "Duration", value: leaseData.duration },
    { label: "Notice Period", value: leaseData.noticePeriod },
    { label: "Renewal Option", value: leaseData.renewalOption },
    { label: "Signed Date", value: leaseData.signedDate },
    { label: "Move-in Date", value: leaseData.moveInDate },
    { label: "Occupancy Limit", value: leaseData.occupancyLimit },
    { label: "Pets Allowed", value: leaseData.petsAllowed },
    { label: "Parking Spaces", value: leaseData.parkingSpaces },
  ];

  return (
    <div className="info-grid">
      {infoItems.map((item, idx) => (
        <div key={idx} className="info-item">
          <div className="info-item__label">{item.label}</div>
          <div className="info-item__value">{item.value}</div>
        </div>
      ))}
    </div>
  );
};
