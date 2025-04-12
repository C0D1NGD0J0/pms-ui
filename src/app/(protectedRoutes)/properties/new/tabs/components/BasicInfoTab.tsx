"use client";
import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import {
  DebouncedInput,
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

export function BasicInfoTab() {
  const [addressValidation, setAddressValidation] = useState({
    isValid: true,
    message: "",
    suggestedAddress: "",
  });

  const [formData, setFormData] = useState({
    propertyName: "",
    propertyType: "",
    propertyStatus: "",
    propertyManager: "",
    yearBuilt: "",
    streetAddress: "",
    unitApartment: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "us",
    purchasePrice: "",
    purchaseDate: "",
    marketValue: "",
    rentAmount: "",
    securityDeposit: "",
    propertyTax: "",
  });
  const propertyTypeOptions = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "condo", label: "Condominium" },
    { value: "townhouse", label: "Townhouse" },
    { value: "commercial", label: "Commercial" },
    { value: "industrial", label: "Industrial" },
  ];
  const propertyStatusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Under Maintenance" },
    { value: "construction", label: "Under Construction" },
  ];
  const propertyManagerOptions = [
    { value: "1", label: "Jonathan Smith" },
    { value: "2", label: "Sarah Johnson" },
    { value: "3", label: "Michael Davis" },
  ];
  const countryOptions = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateAddress = async (
    value: string | number
  ): Promise<{ isValid: boolean; message?: string; data?: any }> => {
    console.log("Validating address:", value);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const addressStr = value.toString().toLowerCase();

    if (addressStr.length < 5) {
      return {
        isValid: false,
        message: "Address is too short",
      };
    }

    // Example: Address formatting/suggestion - only trigger this when the user finishes typing
    // Only suggest when the exact word "main" is found standalone
    const mainWordRegex = /\bmain\b/;
    if (mainWordRegex.test(addressStr) && !addressStr.includes("street")) {
      return {
        isValid: true,
        message: "Did you mean 'Main Street'?",
        data: {
          // This replacement preserves the original case and only replaces standalone "main"
          suggestedAddress: addressStr.replace(mainWordRegex, "Main Street"),
        },
      };
    }

    return {
      isValid: true,
      message: "Address validated successfully",
    };
  };

  // Handle address validation completion
  const handleAddressValidationComplete = (result: {
    isValid: boolean;
    message?: string;
    data?: any;
  }) => {
    setAddressValidation({
      isValid: result.isValid,
      message: result.message || "",
      suggestedAddress: result.data?.suggestedAddress || "",
    });
  };

  // Handle clicking on the suggested address
  const handleSuggestionClick = () => {
    if (addressValidation.suggestedAddress) {
      // Update the form data with the suggested address
      setFormData((prev) => ({
        ...prev,
        streetAddress: addressValidation.suggestedAddress,
      }));

      // Clear the suggestion
      setAddressValidation((prev) => ({
        ...prev,
        suggestedAddress: "",
        message: "Suggested address applied",
      }));
    }
  };

  return (
    <>
      <FormSection
        title="Property Information"
        description="Enter basic information about the property"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="propertyName" label="Property Name" />
            <FormInput
              id="propertyName"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleInputChange}
              placeholder="Enter property name"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="propertyType" label="Property Type" />
            <Select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
              options={propertyTypeOptions}
              placeholder="Select property type"
            />
          </FormField>
          <FormField>
            <FormLabel
              htmlFor="propertyStatus"
              label="Property Status"
              required
            />
            <Select
              id="propertyStatus"
              name="propertyStatus"
              value={formData.propertyStatus}
              onChange={handleInputChange}
              options={propertyStatusOptions}
              placeholder="Select status"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="propertyManager" label="Property Manager" />
            <Select
              id="propertyManager"
              name="propertyManager"
              value={formData.propertyManager}
              onChange={handleInputChange}
              options={propertyManagerOptions}
              placeholder="Assign property manager"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="yearBuilt" label="Year Built" />
            <FormInput
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              value={formData.yearBuilt}
              onChange={handleInputChange}
              placeholder="Enter year built"
              hasError={false}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Financial Information"
        description="Enter financial details for the property"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="purchasePrice" label="Purchase Price ($)" />
            <FormInput
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              value={formData.purchasePrice}
              onChange={handleInputChange}
              placeholder="Enter purchase price"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="purchaseDate" label="Purchase Date" />
            <FormInput
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              placeholder="Select purchase date"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="marketValue" label="Market Value ($)" />
            <FormInput
              id="marketValue"
              name="marketValue"
              type="number"
              value={formData.marketValue}
              onChange={handleInputChange}
              placeholder="Enter current market value"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="rentAmount" label="Rent Amount ($)" />
            <FormInput
              id="rentAmount"
              name="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={handleInputChange}
              placeholder="Enter monthly rent amount"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="securityDeposit" label="Security Deposit ($)" />
            <FormInput
              id="securityDeposit"
              name="securityDeposit"
              type="number"
              value={formData.securityDeposit}
              onChange={handleInputChange}
              placeholder="Enter security deposit amount"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="propertyTax" label="Property Tax ($)" />
            <FormInput
              id="propertyTax"
              name="propertyTax"
              type="number"
              value={formData.propertyTax}
              onChange={handleInputChange}
              placeholder="Enter annual property tax"
              hasError={false}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Property Address"
        description="Enter the complete address of the property"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="streetAddress" label="Street Address" />
            <DebouncedInput
              id="streetAddress"
              name="streetAddress"
              type="text"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="Enter street address"
              debounceDelay={800}
              validateFn={validateAddress}
              onValidationComplete={handleAddressValidationComplete}
            />
            {/* {addressValidation.message && (
              <small
                className={`validation-message ${
                  addressValidation.isValid ? "info" : "error"
                }`}
              >
                {addressValidation.message}
              </small>
            )}
            {addressValidation.suggestedAddress && (
              <small className="suggestion" onClick={handleSuggestionClick}>
                Suggested: {addressValidation.suggestedAddress} (click to apply)
              </small>
            )} */}
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="unitApartment"
              label="Unit/Apartment (optional)"
            />
            <FormInput
              id="unitApartment"
              name="unitApartment"
              type="text"
              value={formData.unitApartment}
              onChange={handleInputChange}
              placeholder="Enter unit or apartment number"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="city" label="City" />
            <FormInput
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="stateProvince" label="State/Province" />
            <FormInput
              id="stateProvince"
              name="stateProvince"
              type="text"
              value={formData.stateProvince}
              onChange={handleInputChange}
              placeholder="Enter state/province"
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="postalCode" label="Postal Code" />
            <FormInput
              id="postalCode"
              name="postalCode"
              type="text"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Enter postal code"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="country" label="Country" />
            <Select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              options={countryOptions}
              placeholder="Select country"
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
