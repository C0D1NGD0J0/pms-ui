import React from "react";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";

interface Props {
  units: UnitsFormValues["units"];
  currentUnit: UnitFormValues;
  setCurrentUnit: (unit: UnitFormValues) => void;
  validateUnit: (unit: UnitFormValues) => {
    isValid: boolean;
    errors: string[];
  };
}

export function UnitNavigation({
  units,
  currentUnit,
  validateUnit,
  setCurrentUnit,
}: Props) {
  if (units.length < 1) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        border: "1px solid #e9ecef",
      }}
    >
      <h5 style={{ margin: "0 0 10px 0", color: "#124e66" }}>
        Unit Navigation
      </h5>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {units.map((unit, index) => {
          const validation = validateUnit(unit);
          const isActive = currentUnit?.puid === (unit as any).puid;
          const unitWithPuid = unit as any; // Cast to bypass puid validation for now

          return (
            <button
              key={unitWithPuid.puid || index}
              type="button"
              onClick={() => {
                setCurrentUnit(unitWithPuid);
              }}
              style={{
                padding: "8px 16px",
                border: "1px solid #dee2e6",
                borderRadius: "4px",
                backgroundColor: isActive ? "#007bff" : "white",
                color: isActive ? "white" : "#495057",
                cursor: "pointer",
                fontSize: "14px",
                position: "relative",
              }}
              title={`Unit ${index + 1}: ${unit.unitNumber || "Untitled"}`}
            >
              {unit.unitNumber || `Unit ${index + 1}`}
              {!validation.isValid && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#dc3545",
                    borderRadius: "50%",
                  }}
                  title="Has validation errors"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
