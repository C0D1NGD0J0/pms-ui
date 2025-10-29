import React, { useState } from "react";
import { Button } from "@components/FormElements";
import { UnitFormValues } from "@interfaces/unit.interface";

interface Props {
  currentUnit: UnitFormValues;
  canAddUnit: boolean;
  onCopyUnit: () => void;
  isFormSubmitting?: boolean;
  unitNumberingScheme: string;
  onRemoveUnit: (unit: UnitFormValues) => void;
  onNumberingSchemeChange: (scheme: string) => void;
  prefixOptions: { value: string; label: string; example: string }[];
}

export function UnitActions({
  onCopyUnit,
  canAddUnit,
  onRemoveUnit,
  prefixOptions,
  unitNumberingScheme,
  isFormSubmitting = false,
  currentUnit,
  onNumberingSchemeChange,
}: Props) {
  const [isNumberingDropdownOpen, setIsNumberingDropdownOpen] = useState(false);

  const currentSchemeLabel =
    prefixOptions.find((option) => option.value === unitNumberingScheme)
      ?.label || "Numeric";
  return (
    <div className="unit-actions">
      <div style={{ position: "relative" }}>
        <Button
          label=""
          type="button"
          className="btn-text"
          title={"Numbering Scheme"}
          icon={<i className="bx bx-cog"></i>}
          onClick={() => {
            setIsNumberingDropdownOpen(!isNumberingDropdownOpen);
          }}
        />
        {isNumberingDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: "0",
              zIndex: 1000,
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minWidth: "200px",
              padding: "8px 0",
            }}
          >
            {prefixOptions.map((option: any) => (
              <button
                key={option.value}
                type="button"
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  background:
                    unitNumberingScheme === option.value
                      ? "#f0f8ff"
                      : "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  onNumberingSchemeChange(option.value);
                  setIsNumberingDropdownOpen(false);
                }}
                onMouseEnter={(e) => {
                  if (unitNumberingScheme !== option.value) {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                  }
                }}
                onMouseLeave={(e) => {
                  if (unitNumberingScheme !== option.value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {currentSchemeLabel === option.label ? (
                  <strong>{option.label}</strong>
                ) : (
                  <span>{option.label}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button
        label=""
        title="Copy Unit"
        className="btn-text"
        onClick={onCopyUnit}
        disabled={!canAddUnit || isFormSubmitting}
        icon={<i className="bx bx-copy success"></i>}
      />
      <Button
        label=""
        title="Remove Unit"
        className="btn-text"
        disabled={isFormSubmitting}
        icon={<i className="bx bx-trash danger"></i>}
        onClick={() => onRemoveUnit(currentUnit)}
      />
    </div>
  );
}
