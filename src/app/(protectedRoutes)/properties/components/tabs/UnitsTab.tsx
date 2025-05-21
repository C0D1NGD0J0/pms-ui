"use client";

import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import {
  UnitStatusEnum,
  UnitTypeEnum,
  IUnit,
} from "@interfaces/unit.interface";
import {
  EditPropertyFormValues,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Textarea,
  Select,
  Button,
} from "@components/FormElements";

interface Props {
  form: UseFormReturnType<PropertyFormValues | EditPropertyFormValues>;
  handleOnChange: (
    event:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | string,
    field?: string
  ) => void;
}

export function UnitsTab({ form, handleOnChange }: Props) {
  // Initialize units array if it doesn't exist
  if (!form.values.units) {
    form.setFieldValue("units", []);
  }

  const units = form.values.units || [];
  const isMultiUnit = units.length > 0;

  // Generate a unique ID for new units
  const generateUnitId = () =>
    `unit_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Add a new unit
  const addUnit = () => {
    const newUnit: IUnit = {
      id: generateUnitId(),
      unitNumber: "",
      type: UnitTypeEnum.ONE_BR,
      status: UnitStatusEnum.AVAILABLE,
      floor: 1,
      isActive: true,
      specifications: {
        totalArea: 0,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
      },
      amenities: {
        airConditioning: false,
        washerDryer: false,
        dishwasher: false,
        parking: false,
        storage: false,
        cableTV: false,
        internet: false,
      },
      utilities: {
        gas: false,
        trash: false,
        water: false,
        heating: false,
        centralAC: false,
      },
      fees: {
        currency: "USD",
        rentAmount: 0,
        securityDeposit: 0,
      },
      description: "",
    };

    const updatedUnits = [...units, newUnit];
    form.setFieldValue("units", updatedUnits);
  };

  // Remove a unit by index
  const removeUnit = (index: number) => {
    const updatedUnits = [...units];
    updatedUnits.splice(index, 1);
    form.setFieldValue("units", updatedUnits);
  };

  // Toggle multi-unit property
  const toggleMultiUnit = (checked: boolean) => {
    if (checked && units.length === 0) {
      addUnit();
    } else if (!checked) {
      form.setFieldValue("units", []);
    }
  };

  // Function to add section title styling
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h4
      style={{
        marginTop: "20px",
        marginBottom: "10px",
        color: "#124e66",
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: "8px",
      }}
    >
      {children}
    </h4>
  );

  // Generate options for unit type select
  const unitTypeOptions = Object.entries(UnitTypeEnum).map(([key, value]) => ({
    value,
    label:
      key === "STUDIO"
        ? "Studio"
        : key === "ONE_BR"
        ? "1 Bedroom"
        : key === "TWO_BR"
        ? "2 Bedroom"
        : key === "THREE_BR"
        ? "3 Bedroom"
        : key === "FOUR_BR_PLUS"
        ? "4+ Bedroom"
        : key === "PENTHOUSE"
        ? "Penthouse"
        : key === "LOFT"
        ? "Loft"
        : key === "COMMERCIAL"
        ? "Commercial Space"
        : "Other",
  }));

  // Generate options for unit status select
  const unitStatusOptions = Object.values(UnitStatusEnum).map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }));

  return (
    <>
      <FormSection
        title="Property Units"
        description="Add and manage individual units for this property"
      >
        <div className="form-fields">
          <FormField>
            <Checkbox
              id="is-multi-unit"
              name="isMultiUnit"
              checked={isMultiUnit}
              onChange={(e) => toggleMultiUnit(e.target.checked)}
              label="This is a multi-unit property"
            />
          </FormField>
        </div>

        {isMultiUnit && (
          <div id="units-section">
            <div className="units-container">
              <div className="unit-list">
                {units.map((unit, index) => (
                  <div key={unit.id || index} className="unit-card">
                    <div className="unit-header">
                      <h4>Unit #{index + 1}</h4>
                      <button
                        type="button"
                        className="btn-text"
                        onClick={() => removeUnit(index)}
                        disabled={units.length <= 1}
                      >
                        <i className="bx bx-x"></i>
                      </button>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-number`}
                          label="Unit Number/Name"
                        />
                        <FormInput
                          id={`unit-${index}-number`}
                          name={`units.${index}.unitNumber`}
                          value={unit.unitNumber}
                          placeholder="Enter unit number or name (e.g., 101, A1, Suite 3)"
                          onChange={handleOnChange}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-type`}
                          label="Unit Type"
                        />
                        <Select
                          id={`unit-${index}-type`}
                          name={`units.${index}.type`}
                          value={unit.type}
                          options={unitTypeOptions}
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-size`}
                          label="Unit Size (sq ft)"
                        />
                        <FormInput
                          id={`unit-${index}-size`}
                          name={`units.${index}.specifications.totalArea`}
                          type="number"
                          value={unit.specifications.totalArea}
                          placeholder="Enter unit area"
                          onChange={handleOnChange}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-floor`}
                          label="Floor/Level"
                        />
                        <FormInput
                          id={`unit-${index}-floor`}
                          name={`units.${index}.floor`}
                          type="number"
                          value={unit.floor || 1}
                          placeholder="Enter floor or level"
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-bedrooms`}
                          label="Bedrooms"
                        />
                        <FormInput
                          id={`unit-${index}-bedrooms`}
                          name={`units.${index}.specifications.bedrooms`}
                          type="number"
                          value={unit.specifications.bedrooms || 0}
                          placeholder="Number of bedrooms"
                          onChange={handleOnChange}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-bathrooms`}
                          label="Bathrooms"
                        />
                        <FormInput
                          id={`unit-${index}-bathrooms`}
                          name={`units.${index}.specifications.bathrooms`}
                          type="number"
                          value={unit.specifications.bathrooms || 0}
                          step="0.5"
                          placeholder="Number of bathrooms"
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-occupants`}
                          label="Maximum Occupants"
                        />
                        <FormInput
                          id={`unit-${index}-occupants`}
                          name={`units.${index}.specifications.maxOccupants`}
                          type="number"
                          value={unit.specifications.maxOccupants || 1}
                          placeholder="Maximum number of occupants"
                          onChange={handleOnChange}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-active`}
                          label="Status"
                        />
                        <Select
                          id={`unit-${index}-status`}
                          name={`units.${index}.status`}
                          value={unit.status}
                          options={unitStatusOptions}
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-rent`}
                          label="Monthly Rent ($)"
                        />
                        <FormInput
                          id={`unit-${index}-rent`}
                          name={`units.${index}.fees.rentAmount`}
                          type="number"
                          value={unit.fees.rentAmount}
                          placeholder="Enter monthly rent amount"
                          onChange={handleOnChange}
                        />
                      </FormField>

                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-security`}
                          label="Security Deposit ($)"
                        />
                        <FormInput
                          id={`unit-${index}-security`}
                          name={`units.${index}.fees.securityDeposit`}
                          type="number"
                          value={unit.fees.securityDeposit || 0}
                          placeholder="Enter security deposit amount"
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <div className="form-fields">
                      <FormField>
                        <FormLabel
                          htmlFor={`unit-${index}-description`}
                          label="Unit Description (Optional)"
                        />
                        <Textarea
                          id={`unit-${index}-description`}
                          name={`units.${index}.description`}
                          value={unit.description || ""}
                          rows={3}
                          placeholder="Enter any special features or details about this unit..."
                          onChange={handleOnChange}
                        />
                      </FormField>
                    </div>

                    <SectionTitle>Amenities</SectionTitle>
                    <div className="form-fields checkbox-fields">
                      <FormField>
                        <Checkbox
                          id={`unit-${index}-aircon`}
                          name={`units.${index}.amenities.airConditioning`}
                          checked={unit.amenities.airConditioning}
                          onChange={handleOnChange}
                          label="Air Conditioning"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-washer-dryer`}
                          name={`units.${index}.amenities.washerDryer`}
                          checked={unit.amenities.washerDryer}
                          onChange={handleOnChange}
                          label="Washer/Dryer"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-dishwasher`}
                          name={`units.${index}.amenities.dishwasher`}
                          checked={unit.amenities.dishwasher}
                          onChange={handleOnChange}
                          label="Dishwasher"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-parking`}
                          name={`units.${index}.amenities.parking`}
                          checked={unit.amenities.parking}
                          onChange={handleOnChange}
                          label="Parking"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-storage`}
                          name={`units.${index}.amenities.storage`}
                          checked={unit.amenities.storage}
                          onChange={handleOnChange}
                          label="Storage"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-cable`}
                          name={`units.${index}.amenities.cableTV`}
                          checked={unit.amenities.cableTV}
                          onChange={handleOnChange}
                          label="Cable TV"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-internet`}
                          name={`units.${index}.amenities.internet`}
                          checked={unit.amenities.internet}
                          onChange={handleOnChange}
                          label="Internet"
                        />
                      </FormField>
                    </div>

                    <SectionTitle>Utilities</SectionTitle>
                    <div className="form-fields checkbox-fields">
                      <FormField>
                        <Checkbox
                          id={`unit-${index}-water`}
                          name={`units.${index}.utilities.water`}
                          checked={unit.utilities.water}
                          onChange={handleOnChange}
                          label="Water"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-gas`}
                          name={`units.${index}.utilities.gas`}
                          checked={unit.utilities.gas}
                          onChange={handleOnChange}
                          label="Gas"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-trash`}
                          name={`units.${index}.utilities.trash`}
                          checked={unit.utilities.trash}
                          onChange={handleOnChange}
                          label="Trash"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-heating`}
                          name={`units.${index}.utilities.heating`}
                          checked={unit.utilities.heating}
                          onChange={handleOnChange}
                          label="Heating"
                        />
                      </FormField>

                      <FormField>
                        <Checkbox
                          id={`unit-${index}-central-ac`}
                          name={`units.${index}.utilities.centralAC`}
                          checked={unit.utilities.centralAC}
                          onChange={handleOnChange}
                          label="Central AC"
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                className="btn btn-outline add-unit-btn"
                label="Add Another Unit"
                icon={<i className="bx bx-plus"></i>}
                onClick={addUnit}
              />
            </div>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Bulk Unit Import"
        description="Upload a spreadsheet to add multiple units at once"
      >
        <div className="form-fields">
          <div className="form-field">
            <div className="file-upload-area">
              <i className="bx bx-file-import"></i>
              <p>Drag and drop CSV/Excel file here or click to browse</p>
              <input
                type="file"
                id="bulk-units-import"
                accept=".csv,.xlsx,.xls"
                className="file-input"
              />
              <button className="btn btn-outline">Browse Files</button>
            </div>
            <p className="help-text mt-2">
              Download our
              <a href="#" className="text-primary">
                template spreadsheet
              </a>
              for the correct format
            </p>
          </div>
        </div>
      </FormSection>
    </>
  );
}
