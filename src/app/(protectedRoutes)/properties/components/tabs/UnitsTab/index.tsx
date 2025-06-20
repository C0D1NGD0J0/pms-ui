import React from "react";
import { Button } from "@components/FormElements";
import { FormSection } from "@components/FormLayout";
import { PropertyFormValues } from "@interfaces/property.interface";

import { useUnitsForm } from "./hook";
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
  const {
    unitForm,
    isVisible,
    canAddUnit,
    formConfig,
    currentUnit,
    customPrefix,
    isSubmitting,
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
  } = useUnitsForm({
    property,
  });

  if (!currentUnit && allUnits.length) {
    return (
      <UnitNavigation
        units={allUnits}
        currentUnit={null}
        hasNextPage={hasNextPage}
        validateUnit={validateUnit}
        onLoadMore={handleLoadMore}
        addNewUnit={handleAddAnotherUnit}
        setCurrentUnit={handleUnitSelect}
        isLoadingMore={isFetchingNextPage}
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
      <UnitNavigation
        units={allUnits}
        currentUnit={currentUnit}
        hasNextPage={hasNextPage}
        validateUnit={validateUnit}
        onLoadMore={handleLoadMore}
        addNewUnit={handleAddAnotherUnit}
        setCurrentUnit={handleUnitSelect}
        isLoadingMore={isFetchingNextPage}
      />

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
        <FormSection title="Basic Details">
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

        <FormSection title="Financial Information">
          <UnitFinancialInfo
            unit={currentUnit}
            errors={unitForm.errors}
            isTouched={unitForm.isTouched}
            onFieldChange={handleOnChange}
            currencyOptions={formConfig?.currencies || []}
          />
        </FormSection>

        <FormSection title="Utilities">
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
          label="Save Unit Changes"
          className="btn btn-primary btn-grow"
          disabled={!unitForm.isValid || isSubmitting}
        />
      </div>
    </div>
  );
}
