import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormField, FormLabel, Select } from "@components/FormElements";
import {
  LeaseableProperty,
  LeaseFormValues,
} from "@interfaces/lease.interface";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
  propertyOptions: {
    value: string;
    label: string;
    property: LeaseableProperty;
  }[];
  unitOptions: { value: string; label: string }[];
  selectedProperty: LeaseableProperty | null;
  isLoading: boolean;
}

export const PropertySelectionTab = ({
  leaseForm,
  handleOnChange,
  propertyOptions,
  unitOptions,
  selectedProperty,
  isLoading,
}: Props) => {
  const hasUnits = selectedProperty?.units && selectedProperty.units.length > 0;

  console.log("PropertySelectionTab Debug:", {
    selectedProperty,
    hasUnits,
    unitOptions,
    propertyId: leaseForm.values.property.id,
    unitsCount: selectedProperty?.units?.length,
  });

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors["property.id"] as string) || "",
            touched: leaseForm.isTouched("property.id"),
          }}
        >
          <FormLabel htmlFor="property" label="Property" required />
          <Select
            id="property"
            name="property.id"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) => {
              console.log("Select onChange triggered:", value);
              handleOnChange(value, "property.id");
            }}
            options={propertyOptions}
            placeholder={
              isLoading ? "Loading properties..." : "Select property"
            }
            value={leaseForm.values.property.id}
            disabled={isLoading}
          />
        </FormField>
      </div>

      {hasUnits && leaseForm.values.property.id && (
        <div className="form-fields">
          <FormField
            error={{
              msg: (leaseForm.errors["property.unitId"] as string) || "",
              touched: leaseForm.isTouched("property.unitId"),
            }}
          >
            <FormLabel htmlFor="unit" label="Unit" />
            <Select
              id="unit"
              name="property.unitId"
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) => handleOnChange(value, "property.unitId")}
              options={unitOptions}
              placeholder="Select unit"
              value={leaseForm.values.property.unitId || ""}
            />
          </FormField>
        </div>
      )}
    </>
  );
};
