import React from "react";
import Link from "next/link";
import { UseFormReturnType } from "@mantine/form";
import { FormField, FormLabel, Select } from "@components/FormElements";
import {
  LeaseableProperty,
  FilteredProperty,
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
  filteredProperties: FilteredProperty[];
  filteredCount: number;
  cuid: string;
  disableFields?: boolean;
}

export const PropertySelectionTab = ({
  leaseForm,
  handleOnChange,
  propertyOptions,
  unitOptions,
  selectedProperty,
  isLoading,
  filteredProperties,
  cuid,
  filteredCount,
}: Props) => {
  const hasUnits = selectedProperty?.units && selectedProperty.units.length > 0;

  return (
    <>
      {filteredCount > 0 && (
        <div className="alert-warning">
          <i className="bx bx-info-circle"></i>
          <div>
            <strong>
              {filteredCount}{" "}
              {filteredCount === 1 ? "property is" : "properties are"} hidden
            </strong>
            <p>
              The following properties require units before they can be leased:
            </p>
            <ul>
              {filteredProperties.map((prop) => (
                <li key={prop.id}>
                  <strong>{prop.name}</strong> ({prop.propertyType})
                </li>
              ))}
            </ul>
            <Link href={`/properties/${cuid}`}>
              Add units to these properties →
            </Link>
          </div>
        </div>
      )}
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
            onChange={(
              value: string | React.ChangeEvent<HTMLSelectElement>
            ) => {
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
            <FormLabel htmlFor="unit" label="Unit" required />
            <Select
              id="unit"
              name="property.unitId"
              onChange={(
                value: string | React.ChangeEvent<HTMLSelectElement>
              ) => {
                handleOnChange(value, "property.unitId");
              }}
              options={unitOptions}
              placeholder="Select unit"
              disabled={isLoading}
              value={leaseForm.values.property.unitId || ""}
            />
          </FormField>
        </div>
      )}
    </>
  );
};
