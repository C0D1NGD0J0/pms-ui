import React from "react";

interface LeaseHeaderProps {
  luid: string;
  status: string;
  propertyName: string;
  propertyAddress: string;
}

export const LeaseHeader: React.FC<LeaseHeaderProps> = ({
  luid,
  status,
  propertyName,
  propertyAddress,
}) => {
  return (
    <div className="lease-header">
      <h1 className="lease-header__title">
        Lease #{luid}
        <span className="lease-status-badge active">
          <i className="bx bx-check-circle"></i>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </h1>
      <p className="lease-header__property">
        <i className="bx bx-building-house"></i> {propertyName}
      </p>
      <p className="lease-header__address">
        <i className="bx bx-map"></i> {propertyAddress}
      </p>
    </div>
  );
};
