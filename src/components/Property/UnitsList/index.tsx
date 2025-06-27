import React, { useState } from "react";

export interface Unit {
  id: string;
  number: string;
  status: "occupied" | "vacant" | "maintenance";
  details: string;
  tenant: string;
  rent: string;
}

export interface UnitsListProps {
  units: Unit[];
  searchable?: boolean;
  onUnitClick?: (unit: Unit) => void;
}

export function UnitsList({
  units,
  searchable = true,
  onUnitClick,
}: UnitsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUnits = units.filter(
    (unit) =>
      unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.tenant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar-section">
      <div className="units-header">
        <h4>Property Units</h4>
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
            key={unit.id}
            className={`unit-card ${unit.status}`}
            onClick={() => onUnitClick?.(unit)}
          >
            <div className="unit-header">
              <div className="unit-number">{unit.number}</div>
              <div className={`unit-status ${unit.status}`}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
              </div>
            </div>
            <div className="unit-details">{unit.details}</div>
            <div className="unit-details">{unit.tenant}</div>
            <div className="unit-rent">{unit.rent}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
