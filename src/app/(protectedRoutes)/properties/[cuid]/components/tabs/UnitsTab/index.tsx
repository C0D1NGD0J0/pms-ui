import React, { useState } from "react";
import { Loading } from "@components/Loading";
import { extractChanges } from "@utils/helpers";
import { Button } from "@components/FormElements";
import { FormSection } from "@components/FormLayout";
import { Modal } from "@components/FormElements/Modal";
import { PropertyFormValues } from "@interfaces/property.interface";
import { UnitsFormValues, UnitFormValues } from "@interfaces/unit.interface";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<UnitFormValues | null>(null);
  const [navigationTarget, setNavigationTarget] =
    useState<UnitFormValues | null>(null);

  const {
    unitForm,
    isVisible,
    formConfig,
    customPrefix,
    isSubmitting,
    isDeleting,
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
    handleDeleteUnit,
    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
    allUnits,
    handleAddAnotherUnit,
    isEditMode,
    totalUnitsCreated,
    newUnits,
    hasUnsavedChanges,
    propertyManagers,
  } = useUnitForm({ property });
  const canAddMoreUnits = property.unitInfo?.canAddUnit || canAddUnit;
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
    if (currentUnit?.puid === unit.puid) {
      return hasUnsavedChanges;
    }

    const originalSavedUnit = allUnits.find(
      (u) => u.puid === unit.puid && u.propertyId && u.id
    );
    const formUnit = newUnits.find((formUnit) => formUnit.puid === unit.puid);

    if (!originalSavedUnit || !formUnit) return false;
    const changes = extractChanges(originalSavedUnit, formUnit);
    return changes !== null;
  };

  const handleSaveAndSwitch = async () => {
    try {
      if (isEditMode) {
        // in edit mode, handleSubmit expects UnitsFormValues
        (handleSubmit as (values: UnitsFormValues) => void)(unitForm.values);
      } else {
        // in create mode, handleSubmit is wrapped with onSubmit and expects no args
        (handleSubmit as () => void)();
      }
    } catch (error) {
      console.error("Error saving unit:", error);
      return;
    }

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

  const handleDeleteRequest = (unit: UnitFormValues) => {
    if (unit.id && unit.propertyId) {
      setUnitToDelete(unit);
      setShowDeleteModal(true);
    } else if (unit.puid) {
      handleRemoveUnit(unit.puid);
    }
  };

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      handleDeleteUnit(unitToDelete);
      setShowDeleteModal(false);
      setUnitToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUnitToDelete(null);
  };

  if (!currentUnit && allUnits.length) {
    return (
      <UnitNavigation
        units={allUnits}
        currentUnit={null}
        hasNextPage={hasNextPage}
        onLoadMore={handleLoadMore}
        validateUnit={validateUnit}
        canAddUnit={canAddMoreUnits}
        addNewUnit={handleAddAnotherUnit}
        isLoadingMore={isFetchingNextPage}
        setCurrentUnit={handleProtectedUnitSelect}
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

  if (isDeleting || isSubmitting) {
    return (
      <Loading
        description={isDeleting ? "Deleting unit..." : "Saving unit..."}
      />
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
        hasNextPage={hasNextPage}
        currentUnit={currentUnit}
        validateUnit={validateUnit}
        onLoadMore={handleLoadMore}
        canAddUnit={canAddMoreUnits}
        addNewUnit={handleAddAnotherUnit}
        isLoadingMore={isFetchingNextPage}
        setCurrentUnit={handleProtectedUnitSelect}
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

      <Modal isOpen={showDeleteModal} onClose={handleCancelDelete}>
        <div style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "15px", color: "#dc3545" }}>
            Delete Unit
          </h3>
          <p style={{ marginBottom: "20px" }}>
            Are you sure you want to permanently delete unit{" "}
            <strong>{unitToDelete?.unitNumber}</strong>?
          </p>
          <div
            style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}
          >
            <div>Unit Type: {unitToDelete?.unitType}</div>
            <div>Floor: {unitToDelete?.floor}</div>
            <div>Status: {unitToDelete?.status}</div>
          </div>
          <p
            style={{ marginBottom: "20px", color: "#dc3545", fontSize: "14px" }}
          >
            <strong>This action cannot be undone.</strong>
          </p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
          >
            <Button
              label="Cancel"
              onClick={handleCancelDelete}
              className="btn btn-outline"
              disabled={isDeleting}
            />
            <Button
              label={isDeleting ? "Deleting..." : "Delete Unit"}
              onClick={handleConfirmDelete}
              className="btn btn-danger"
              disabled={isDeleting}
            />
          </div>
        </div>
      </Modal>

      <div className="form-header">
        <div className="form-actions">
          <UnitActions
            currentUnit={currentUnit}
            onCopyUnit={handleCopyUnit}
            canAddUnit={canAddMoreUnits}
            onRemoveUnit={handleDeleteRequest}
            unitNumberingScheme={unitNumberingScheme}
            onNumberingSchemeChange={setUnitNumberingScheme}
            prefixOptions={
              formConfig?.prefixOptions?.map((option) => ({
                ...option,
                example: option.example || "",
              })) || []
            }
          />
        </div>
      </div>

      <div className="unit-editor">
        <FormSection title="Basic Details" collapsable defaultCollapsed>
          <UnitBasicInfo
            unit={currentUnit}
            errors={unitForm.errors}
            isFieldVisible={isVisible}
            customPrefix={customPrefix}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            unitTypeOptions={formConfig?.unitTypes || []}
            unitStatusOptions={formConfig?.unitStatus || []}
            propertyManagers={propertyManagers}
          />
        </FormSection>

        <FormSection title="Financial Information" collapsable defaultCollapsed>
          <UnitFinancialInfo
            unit={currentUnit}
            errors={unitForm.errors}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            currencyOptions={formConfig?.currencies || []}
          />
        </FormSection>

        <FormSection title="Utilities" collapsable defaultCollapsed>
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
          onClick={() => currentUnit.puid && handleRemoveUnit(currentUnit.puid)}
        />
        <Button
          form="units-form"
          onClick={() => {
            if (isEditMode) {
              (handleSubmit as (values: UnitsFormValues) => void)(
                unitForm.values
              );
            } else {
              (handleSubmit as () => void)();
            }
          }}
          className="btn btn-primary btn-grow"
          disabled={!unitForm.isValid || isSubmitting}
          label={isEditMode ? "Update Unit" : "Save Unit Changes"}
        />
      </div>
    </div>
  );
}
