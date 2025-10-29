import React from "react";
import { UnitFormValues } from "@interfaces/unit.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";

interface Props {
  customPrefix: string;
  errors: Record<string, any>;
  unit: UnitFormValues | null;
  isTouched: (field: string) => boolean;
  unitStatusOptions: { value: string; label: string }[];
  unitTypeOptions: { value: string; label: string }[];
  isFieldVisible: (
    fieldName: string,
    category?: "specifications" | "amenities" | "utilities" | "fees"
  ) => boolean;
  onFieldChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export function UnitBasicInfo({
  unit,
  errors,
  isTouched,
  onFieldChange,
  unitTypeOptions,
  unitStatusOptions,
  isFieldVisible,
}: Props) {
  if (!unit) {
    return <div className="error-message">No unit selected</div>;
  }
  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: (errors["unitNumber"] as string) || "",
            touched: isTouched("unitNumber"),
          }}
        >
          <FormLabel htmlFor="unit-number" label="Unit Number/Name" />
          <FormInput
            id="unit-number"
            name="unitNumber"
            value={unit.unitNumber}
            onChange={onFieldChange}
            hasError={!!errors["unitNumber"]}
            placeholder="Enter unit number or name (e.g., 101, A1, Suite 3)"
          />
        </FormField>

        <FormField
          error={{
            msg: (errors["unitType"] as string) || "",
            touched: isTouched("unitType"),
          }}
        >
          <FormLabel htmlFor="unit-type" label="Unit Type" />
          <Select
            id="unit-type"
            name="unitType"
            value={unit.unitType}
            onChange={onFieldChange}
            options={unitTypeOptions}
            placeholder="Select unit type"
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (errors["specifications.totalArea"] as string) || "",
            touched: isTouched("specifications.totalArea"),
          }}
        >
          <FormLabel htmlFor="unit-size" label="Unit Size (sq ft)" />
          <FormInput
            type="number"
            id="unit-size"
            onChange={(e) => {
              e.target.value = parseInt(e.target.value) as unknown as string;
              onFieldChange(e);
            }}
            placeholder="Enter unit area"
            name="specifications.totalArea"
            value={unit.specifications.totalArea}
            hasError={!!errors["specifications.totalArea"]}
          />
        </FormField>

        <FormField
          error={{
            msg: (errors["floor"] as string) || "",
            touched: isTouched("floor"),
          }}
        >
          <FormLabel htmlFor="unit-floor" label="Floor/Level" />
          <FormInput
            id="unit-floor"
            name="floor"
            type="number"
            value={unit.floor}
            onChange={(e) => {
              e.target.value = Number(e.target.value) as unknown as string;
              onFieldChange(e);
            }}
            hasError={!!errors["floor"]}
            placeholder="Enter floor or level"
          />
        </FormField>
      </div>
      <div className="form-fields">
        {isFieldVisible("rooms", "specifications") && (
          <FormField
            error={{
              msg: (errors["specifications.rooms"] as string) || "",
              touched: isTouched("specifications.rooms"),
            }}
          >
            <FormLabel htmlFor="unit-rooms" label="Rooms" />
            <FormInput
              min="0"
              type="number"
              id="unit-rooms"
              onChange={(e) => {
                e.target.value = Number(e.target.value) as unknown as string;
                onFieldChange(e);
              }}
              name="specifications.rooms"
              placeholder="Number of rooms"
              value={unit.specifications.rooms}
              hasError={!!errors["specifications.rooms"]}
            />
          </FormField>
        )}

        {isFieldVisible("bathrooms", "specifications") && (
          <FormField
            error={{
              msg: (errors["specifications.bathrooms"] as string) || "",
              touched: isTouched("specifications.bathrooms"),
            }}
          >
            <FormLabel htmlFor="unit-bathrooms" label="Bathrooms" />
            <FormInput
              min="0"
              step="0.5"
              type="number"
              id="unit-bathrooms"
              onChange={(e) => {
                e.target.value = Number(e.target.value) as unknown as string;
                onFieldChange(e);
              }}
              name="specifications.bathrooms"
              placeholder="Number of bathrooms"
              value={unit.specifications.bathrooms}
              hasError={!!errors["specifications.bathrooms"]}
            />
          </FormField>
        )}
      </div>

      <div className="form-fields">
        {isFieldVisible("maxOccupants", "specifications") && (
          <FormField
            error={{
              msg: (errors["specifications.maxOccupants"] as string) || "",
              touched: isTouched("specifications.maxOccupants"),
            }}
          >
            <FormLabel htmlFor="unit-occupants" label="Max Occupants" />
            <FormInput
              min="1"
              type="number"
              id="unit-occupants"
              onChange={(e) => {
                e.target.value = Number(e.target.value) as unknown as string;
                onFieldChange(e);
              }}
              name="specifications.maxOccupants"
              value={unit.specifications.maxOccupants}
              placeholder="Maximum number of occupants"
              hasError={!!errors["specifications.maxOccupants"]}
            />
          </FormField>
        )}
        <FormField
          error={{
            msg: (errors["status"] as string) || "",
            touched: isTouched("status"),
          }}
        >
          <FormLabel htmlFor="unit-status" label="Unit Status" />
          <Select
            id="unit-status"
            name="status"
            value={unit.status}
            onChange={onFieldChange}
            options={unitStatusOptions}
            placeholder="Select unit status"
          />
        </FormField>
      </div>
    </>
  );
}
