import React from "react";
import { Button } from "@components/FormElements";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";

interface Props {
  units: UnitsFormValues["units"];
  currentUnit: UnitFormValues | null;
  setCurrentUnit: (unit: UnitFormValues) => void;
  validateUnit: (unit: UnitFormValues) => {
    isValid: boolean;
    errors: string[];
  };
  canAddUnit: boolean;
  addNewUnit: () => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  hasUnsavedChanges?: (unit: UnitFormValues) => boolean;
}

export function UnitNavigation({
  units,
  currentUnit,
  validateUnit,
  setCurrentUnit,
  onLoadMore,
  hasNextPage,
  canAddUnit,
  addNewUnit,
  isLoadingMore,
  hasUnsavedChanges,
}: Props) {
  if (units.length < 1) {
    return (
      <div className="unit-navigation">
        <div className="unit-navigation__header">
          <h5 className="unit-navigation__title">Unit Navigation</h5>
          <button type="button" className="unit-navigation__add-btn">
            Add Unit
          </button>
        </div>
        <div className="unit-navigation__empty-state">
          No units available. Click &ldquo;Add Unit&rdquo; to create your first
          unit.
        </div>
      </div>
    );
  }

  return (
    <div className="unit-navigation">
      <div className="unit-navigation__header">
        <h5 className="unit-navigation__title">Unit Navigation</h5>
        <div className="unit-navigation__load-more">
          <Button
            label="Add Unit"
            onClick={addNewUnit}
            disabled={!canAddUnit}
            className="btn-success btn-rounded"
          />
          {hasNextPage && (
            <Button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="btn btn-rounded btn-outline"
              label={isLoadingMore ? "Loading..." : "Load More"}
            />
          )}
        </div>
      </div>

      <div className="unit-navigation__list">
        {units.map((unit, index) => {
          const validation = validateUnit(unit);
          const isActive = currentUnit?.puid === (unit as any).puid;
          const unitWithPuid = unit as any;

          const isUnsaved = !unitWithPuid.id || !unitWithPuid.propertyId;
          const hasChanges = hasUnsavedChanges?.(unitWithPuid) || false;
          const itemClasses = [
            "unit-navigation__item",
            isActive ? "unit-navigation__item--active" : "",
            isUnsaved || hasChanges ? "unit-navigation__item--unsaved" : "",
            !validation.isValid
              ? "unit-navigation__item--invalid"
              : "unit-navigation__item--valid",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={index}
              className={itemClasses}
              onClick={() => {
                setCurrentUnit(unitWithPuid);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCurrentUnit(unitWithPuid);
                }
              }}
              title={`Unit ${unit.unitNumber || `${index + 1}`}${
                isUnsaved ? " - Unsaved" : ""
              }${hasChanges ? " - Has unsaved changes" : ""}${
                !validation.isValid ? " - Has validation errors" : ""
              }`}
            >
              <p className="unit-navigation__item-text">
                {unit.unitNumber || `Unit ${index + 1}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
