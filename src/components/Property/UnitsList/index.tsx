import React, { useState } from "react";
import { UnitStatus, IUnit } from "@interfaces/unit.interface";
import { IPropertyDocument } from "@interfaces/property.interface";
import { Loading } from "@components/Loading";

export interface UnitsListProps {
  units: IUnit[];
  isLoading: boolean;
  searchable?: boolean;
  onUnitClick?: (unit: IUnit) => void;
  unitsStats: IPropertyDocument["unitInfo"];
}

const formatUnitDetails = (specifications: IUnit["specifications"]) => {
  const parts = [];
  if (specifications.rooms) parts.push(`${specifications.rooms} bed`);
  if (specifications.bathrooms) parts.push(`${specifications.bathrooms} bath`);
  if (specifications.totalArea) parts.push(`${specifications.totalArea} sq ft`);
  return parts.join(", ") || "No details available";
};

const formatRent = (fees: IUnit["fees"]) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: fees.currency,
  });
  return `${formatter.format(fees.rentAmount)}/month`;
};

const getTenantText = (status: UnitStatus, unitNumber: string) => {
  // Static tenant data for now - will be replaced with real tenant data later
  const staticTenants: Record<string, string> = {
    A: "John Doe",
    B: "Available since June 1",
    C: "Kitchen renovation",
    D: "Sarah Smith",
    E: "Mike Johnson",
  };

  if (status === "occupied" && staticTenants[unitNumber]) {
    return staticTenants[unitNumber];
  }

  switch (status) {
    case "available":
      return "Available for rent";
    case "maintenance":
      return "Under maintenance";
    case "reserved":
      return "Reserved";
    case "inactive":
      return "Inactive";
    default:
      return "Occupied";
  }
};

export function UnitsList({
  units,
  searchable = true,
  onUnitClick,
  isLoading = false,
  unitsStats,
}: UnitsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUnits = units.filter((unit) => {
    const unitNumber = unit.unitNumber.toLowerCase();
    const tenantText = getTenantText(
      unit.status,
      unit.unitNumber
    ).toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return unitNumber.includes(searchLower) || tenantText.includes(searchLower);
  });

  if (isLoading) {
    return <Loading description="Fetching property units" />;
  }

  return (
    <div className="sidebar-section">
      <div className="units-header">
        <div
          className="header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h4>Property Units</h4>
          <span>{`${unitsStats?.currentUnits} | ${unitsStats?.maxAllowedUnits}`}</span>
        </div>
        {searchable && (
          <div className="units-search">
            <input
              type="search"
              placeholder="Search units..."
              className="units-search__input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="bx bx-search units-search__icon"></i>
          </div>
        )}
      </div>
      <div className="units-list">
        {filteredUnits.map((unit) => (
          <div
            key={unit.puid || unit.id}
            className={`unit-card ${unit.status}`}
            onClick={() => onUnitClick?.(unit)}
          >
            <div className="unit-header">
              <div className="unit-number">{unit.unitNumber}</div>
              <div className={`unit-status ${unit.status}`}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </div>
            </div>
            <div className="unit-details">
              {formatUnitDetails(unit.specifications)}
            </div>
            <div className="unit-details">
              {getTenantText(unit.status, unit.unitNumber)}
            </div>
            <div className="unit-rent">{formatRent(unit.fees)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
