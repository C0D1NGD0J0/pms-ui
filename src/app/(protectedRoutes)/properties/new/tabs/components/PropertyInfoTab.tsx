"use client";
import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import {
  FormField,
  FormLabel,
  FormInput,
  Checkbox,
  Textarea,
} from "@components/FormElements";

export function PropertyInfoTab() {
  const [formData, setFormData] = useState({
    totalArea: "",
    lotSize: "",
    bedrooms: "",
    bathrooms: "",
    floors: "",
    garageSpaces: "",
    utilities: {
      water: false,
      gas: false,
      electricity: false,
      internet: false,
      trash: false,
      cable: false,
    },
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox change for utilities
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      utilities: {
        ...prev.utilities,
        [name]: checked,
      },
    }));
  };

  return (
    <>
      {/* Property Specifications section */}
      <FormSection
        title="Property Specifications"
        description="Enter detailed specifications about the property"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="totalArea" label="Total Area (sq ft)" />
            <FormInput
              id="totalArea"
              name="totalArea"
              type="number"
              value={formData.totalArea}
              onChange={handleInputChange}
              placeholder="Enter total area"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="lotSize" label="Lot Size (sq ft)" />
            <FormInput
              id="lotSize"
              name="lotSize"
              type="number"
              value={formData.lotSize}
              onChange={handleInputChange}
              placeholder="Enter lot size"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="bedrooms" label="Bedrooms" />
            <FormInput
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleInputChange}
              placeholder="Enter number of bedrooms"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="bathrooms" label="Bathrooms" />
            <FormInput
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={formData.bathrooms}
              onChange={handleInputChange}
              placeholder="Enter number of bathrooms"
              step="0.5"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="floors" label="Floors" />
            <FormInput
              id="floors"
              name="floors"
              type="number"
              value={formData.floors}
              onChange={handleInputChange}
              placeholder="Enter number of floors"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="garageSpaces" label="Garage Spaces" />
            <FormInput
              id="garageSpaces"
              name="garageSpaces"
              type="number"
              value={formData.garageSpaces}
              onChange={handleInputChange}
              placeholder="Enter number of garage spaces"
              hasError={false}
            />
          </FormField>
        </div>
      </FormSection>

      {/* Utilities section */}
      <FormSection
        title="Utilities"
        description="Select utilities included with the property"
      >
        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="water"
              name="water"
              checked={formData.utilities.water}
              onChange={handleCheckboxChange}
              label="Water"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="gas"
              name="gas"
              checked={formData.utilities.gas}
              onChange={handleCheckboxChange}
              label="Gas"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="electricity"
              name="electricity"
              checked={formData.utilities.electricity}
              onChange={handleCheckboxChange}
              label="Electricity"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="internet"
              name="internet"
              checked={formData.utilities.internet}
              onChange={handleCheckboxChange}
              label="Internet"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="trash"
              name="trash"
              checked={formData.utilities.trash}
              onChange={handleCheckboxChange}
              label="Trash"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="cable"
              name="cable"
              checked={formData.utilities.cable}
              onChange={handleCheckboxChange}
              label="Cable TV"
            />
          </FormField>
        </div>
      </FormSection>

      {/* Property Description section */}
      <FormSection
        title="Property Description"
        description="Enter a detailed description of the property"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="description" label="Description" />
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter property description"
              rows={5}
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
