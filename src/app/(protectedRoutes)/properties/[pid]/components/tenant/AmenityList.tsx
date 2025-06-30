import React from "react";

export interface Amenity {
  icon: string;
  label: string;
}

export interface AmenityListProps {
  amenities: Amenity[];
  title?: string;
}

export function AmenityList({
  amenities,
  title = "Property Amenities",
}: AmenityListProps) {
  return (
    <div className="sidebar-section">
      <h4>{title}</h4>
      <div className="amenity-list">
        {amenities.map((amenity, index) => (
          <div key={index} className="amenity-item">
            <i className={`bx ${amenity.icon}`}></i>
            <span>{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
