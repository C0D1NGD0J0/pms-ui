import React, { useState } from "react";
import { FormField, FormLabel, Select } from "@components/FormElements";

export const PropertySelectionTab = () => {
  const [selectedProperty, setSelectedProperty] = useState("");
  const [propertyHasUnits, setPropertyHasUnits] = useState(false);

  // Placeholder options - will be fetched from API
  const propertyOptions = [
    { value: "", label: "Select a property" },
    { value: "prop-1", label: "Sunset Towers - 123 Main St" },
    { value: "prop-2", label: "Oak Street Plaza - 456 Oak St" },
  ];

  const unitOptions = [
    { value: "", label: "Select a unit" },
    { value: "unit-1", label: "Unit 101" },
    { value: "unit-2", label: "Unit 102" },
    { value: "unit-3", label: "Unit 201" },
  ];

  const handlePropertyChange = (
    value: string | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = typeof value === "string" ? value : value.target.value;
    setSelectedProperty(val);
    // In real implementation, check if selected property has units
    // For now, show units for prop-1 only
    setPropertyHasUnits(val === "prop-1");
  };

  return (
    <>
      <div className="form-fields">
        <FormField
          error={{
            msg: "",
            touched: false,
          }}
        >
          <FormLabel htmlFor="property" label="Property" required />
          <Select
            id="property"
            name="property.id"
            onChange={handlePropertyChange}
            options={propertyOptions}
            placeholder="Select property"
            value={selectedProperty}
          />
        </FormField>
      </div>

      {propertyHasUnits && selectedProperty && (
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="unit" label="Unit" required />
            <Select
              id="unit"
              name="property.unitId"
              onChange={() => {}}
              options={unitOptions}
              placeholder="Select unit"
              value=""
            />
          </FormField>
        </div>
      )}
    </>
  );
};
