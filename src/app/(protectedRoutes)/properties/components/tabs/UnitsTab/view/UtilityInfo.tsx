import React from "react";
import { UnitFormValues } from "@interfaces/unit.interface";
import { FormField, Checkbox } from "@components/FormElements";

interface Props {
  unit: UnitFormValues;
  errors: Record<string, any>;
  isTouched: (field: string) => boolean;
  amenitiesOptions: { value: string; label: string }[];
  utilitiesOptions: { value: string; label: string }[];
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function UnitUtilities({
  unit,
  errors,
  isTouched,
  onFieldChange,
  utilitiesOptions,
  amenitiesOptions,
}: Props) {
  return (
    <>
      <div className="form-section">
        <h5>Utilities Included in Rent</h5>
        <div className="form-fields">
          {utilitiesOptions.map(({ value, label }) => {
            return (
              <FormField
                key={value}
                error={{
                  msg: (errors[`utilities.${value}`] as string) || "",
                  touched: isTouched(`utilities.${value}`),
                }}
              >
                <Checkbox
                  id={`unit-utility-${value}`}
                  name={`utilities.${value}`}
                  checked={
                    unit.utilities[value as keyof typeof unit.utilities] ||
                    false
                  }
                  onChange={onFieldChange}
                  label={label}
                />
              </FormField>
            );
          })}
        </div>
      </div>
      <div className="form-section">
        <h5>Unit Amenities</h5>
        <div className="form-fields">
          {amenitiesOptions.map(({ value, label }) => {
            return (
              <FormField
                key={label}
                error={{
                  msg: (errors[`amenities.${label}`] as string) || "",
                  touched: isTouched(`amenities.${label}`),
                }}
              >
                <Checkbox
                  id={`unit-amenity-${label}`}
                  name={`amenities.${label}`}
                  checked={
                    unit.amenities[value as keyof typeof unit.amenities] ||
                    false
                  }
                  onChange={onFieldChange}
                  label={label}
                />
              </FormField>
            );
          })}
        </div>
      </div>
    </>
  );
}
