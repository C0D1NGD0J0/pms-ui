import React, { useState } from "react";
import { extractChanges } from "@utils/helpers";
import { Button } from "@components/FormElements";
import { FormSection } from "@components/FormLayout";
import { Modal } from "@components/FormElements/Modal";
import { UnitFormValues } from "@interfaces/unit.interface";
import { PropertyFormValues } from "@interfaces/property.interface";

import { useUnitForm } from "./hook";
import {
  UnitFinancialInfo,
  UnitNavigation,
  UnitBasicInfo,
  UnitUtilities,
  UnitActions,
} from "./view";

interface Props {
  property: PropertyFormValues;
}

export function UnitsTab({ property }: Props) {
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [navigationTarget, setNavigationTarget] =
    useState<UnitFormValues | null>(null);

  const {
    unitForm,
    isVisible,
    formConfig,
    customPrefix,
    isSubmitting,
    canAddUnit,
    currentUnit,
    validateUnit,
    handleSubmit,
    handleOnChange,
    handleCopyUnit,
    unitNumberingScheme,
    setUnitNumberingScheme,
    handleUnitSelect,
    handleRemoveUnit,
    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
    allUnits,
    handleAddAnotherUnit,
    isEditMode,
    totalUnitsCreated,
    newUnits,
    hasUnsavedChanges,
  } = useUnitForm({ property });

  const pendingUnits = newUnits.filter(
    (unit) => !unit.id || !unit.propertyId
  ).length;

  const handleProtectedUnitSelect = (targetUnit: UnitFormValues) => {
    if (hasUnsavedChanges) {
      setNavigationTarget(targetUnit);
      setShowUnsavedModal(true);
    } else {
      handleUnitSelect(targetUnit);
    }
  };

  const checkUnitHasUnsavedChanges = (unit: UnitFormValues): boolean => {
    // For current unit, use the hasUnsavedChanges state (deep comparison)
    if (currentUnit?.puid === unit.puid) {
      return hasUnsavedChanges;
    }

    // For other units, check if they've been modified from their original saved state
    const originalSavedUnit = allUnits.find(
      (u) => u.puid === unit.puid && u.propertyId && u.id
    );
    const formUnit = newUnits.find((formUnit) => formUnit.puid === unit.puid);

    if (!originalSavedUnit || !formUnit) return false;

    // Use extractChanges to detect actual modifications
    const changes = extractChanges(originalSavedUnit, formUnit);
    return changes !== null;
  };

  const handleSaveAndSwitch = async () => {
    handleSubmit();
    setShowUnsavedModal(false);
    if (navigationTarget) {
      handleUnitSelect(navigationTarget);
      setNavigationTarget(null);
    }
  };

  const handleDiscardAndSwitch = () => {
    setShowUnsavedModal(false);
    if (navigationTarget) {
      handleUnitSelect(navigationTarget);
      setNavigationTarget(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowUnsavedModal(false);
    setNavigationTarget(null);
  };

  if (!currentUnit && allUnits.length) {
    return (
      <UnitNavigation
        units={allUnits}
        currentUnit={null}
        hasNextPage={hasNextPage}
        validateUnit={validateUnit}
        onLoadMore={handleLoadMore}
        setCurrentUnit={handleProtectedUnitSelect}
        isLoadingMore={isFetchingNextPage}
        addNewUnit={handleAddAnotherUnit}
        hasUnsavedChanges={checkUnitHasUnsavedChanges}
      />
    );
  }

  if (!currentUnit) {
    return (
      <div className="form-section">
        <div className="form-header">
          <h3>Units Information</h3>
          <p>Add and configure units for this property</p>
        </div>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>
            No units available. Click &ldquo;Add Unit&rdquo; to get started.
          </p>
          <Button
            type="button"
            label="Add First Unit"
            disabled={!canAddUnit}
            className="btn btn-primary"
            onClick={handleAddAnotherUnit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <div style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
        Mode: {isEditMode ? "Edit" : "Create"} | Unit: {currentUnit.unitNumber}{" "}
        | ID: {currentUnit?.puid ? currentUnit.puid : "No ID"} | Units:{" "}
        {totalUnitsCreated} ({pendingUnits} pending)
      </div>

      <UnitNavigation
        units={allUnits}
        currentUnit={currentUnit}
        hasNextPage={hasNextPage}
        validateUnit={validateUnit}
        onLoadMore={handleLoadMore}
        setCurrentUnit={handleProtectedUnitSelect}
        isLoadingMore={isFetchingNextPage}
        addNewUnit={handleAddAnotherUnit}
        hasUnsavedChanges={checkUnitHasUnsavedChanges}
      />

      <Modal isOpen={showUnsavedModal} onClose={handleCancelNavigation}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "15px" }}>Unsaved Changes</h3>
          <p style={{ marginBottom: "20px" }}>
            You have unsaved changes to unit {currentUnit?.unitNumber}. What
            would you like to do?
          </p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button
              label="Cancel"
              onClick={handleCancelNavigation}
              className="btn btn-outline"
            />
            <Button
              label="Discard Changes"
              onClick={handleDiscardAndSwitch}
              className="btn btn-secondary"
            />
            <Button
              label="Save & Switch"
              onClick={handleSaveAndSwitch}
              className="btn btn-primary"
              disabled={!unitForm.isValid}
            />
          </div>
        </div>
      </Modal>

      <div className="form-header">
        <div className="form-actions">
          <UnitActions
            canAddUnit={canAddUnit}
            currentUnit={currentUnit}
            onCopyUnit={handleCopyUnit}
            onRemoveUnit={handleRemoveUnit}
            unitNumberingScheme={unitNumberingScheme}
            onNumberingSchemeChange={setUnitNumberingScheme}
            prefixOptions={formConfig?.prefixOptions || []}
          />
        </div>
      </div>

      <div className="unit-editor">
        <FormSection title="Basic Details" collapsible defaultCollapsed>
          <UnitBasicInfo
            unit={currentUnit}
            errors={unitForm.errors}
            isFieldVisible={isVisible}
            customPrefix={customPrefix}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            unitTypeOptions={formConfig?.unitTypes || []}
            unitStatusOptions={formConfig?.unitStatus || []}
          />
        </FormSection>

        <FormSection title="Financial Information" collapsible defaultCollapsed>
          <UnitFinancialInfo
            unit={currentUnit}
            errors={unitForm.errors}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            currencyOptions={formConfig?.currencies || []}
          />
        </FormSection>

        <FormSection title="Utilities" collapsible defaultCollapsed>
          <UnitUtilities
            unit={currentUnit}
            errors={unitForm.errors}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            amenitiesOptions={formConfig?.unitAmenities || []}
            utilitiesOptions={formConfig?.unitUtilities || []}
          />
        </FormSection>
      </div>

      <div className="flex-row flex-grow">
        <Button
          label="Cancel"
          disabled={isSubmitting}
          className="btn btn-outline btn-grow"
          onClick={() => handleRemoveUnit(currentUnit.puid)}
        />
        <Button
          form="units-form"
          onClick={handleSubmit}
          label={isEditMode ? "Update Unit" : "Save Unit Changes"}
          className="btn btn-primary btn-grow"
          disabled={!unitForm.isValid || isSubmitting}
        />
      </div>
    </div>
  );
}
