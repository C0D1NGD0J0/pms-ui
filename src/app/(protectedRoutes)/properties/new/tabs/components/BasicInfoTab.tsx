"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import { PropertyFormValues } from "@interfaces/property.interface";
import {
  DebouncedInput,
  DatePicker,
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  form: UseFormReturnType<PropertyFormValues>;
  propertyTypeOptions: { value: string; label: string }[];
  propertyStatusOptions: { value: string; label: string }[];
  handleOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => void;
}

export function BasicInfoTab({
  form,
  propertyTypeOptions,
  propertyStatusOptions,
  handleOnChange,
}: Props) {
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

  return (
    <>
      <FormSection
        title="Property Information"
        description="Enter basic information about the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["name"] as string) || "",
              touched: form.isTouched("name"),
            }}
          >
            <FormLabel htmlFor="name" label="Property Name" required />
            <FormInput
              id="name"
              name="name"
              value={form.values.name}
              onChange={handleOnChange}
              hasError={!!form.errors.name}
              placeholder="Enter property name"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["propertyType"] as string) || "",
              touched: form.isTouched("propertyType"),
            }}
          >
            <FormLabel htmlFor="propertyType" label="Property Type" required />
            <Select
              id="propertyType"
              name="propertyType"
              value={form.values.propertyType}
              onChange={handleOnChange}
              options={propertyTypeOptions}
              placeholder="Select property type"
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["status"] as string) || "",
              touched: form.isTouched("status"),
            }}
          >
            <FormLabel htmlFor="status" label="Property Status" required />
            <Select
              id="status"
              name="status"
              value={form.values.status}
              onChange={handleOnChange}
              options={propertyStatusOptions}
              placeholder="Select status"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["managedBy"] as string) || "",
              touched: form.isTouched("managedBy"),
            }}
          >
            <FormLabel htmlFor="managedBy" label="Property Manager" />
            <Select
              id="managedBy"
              name="managedBy"
              value={form.values.managedBy || ""}
              onChange={handleOnChange}
              options={propertyManagerOptions}
              placeholder="Assign property manager"
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["yearBuilt"] as string) || "",
              touched: form.isTouched("yearBuilt"),
            }}
          >
            <FormLabel htmlFor="yearBuilt" label="Year Built" />
            <FormInput
              id="yearBuilt"
              name="yearBuilt"
              type="number"
              value={form.values.yearBuilt}
              onChange={handleOnChange}
              placeholder="Enter year built"
              min="1800"
              max={new Date().getFullYear() + 10}
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
          <FormField
            error={{
              msg:
                (form.errors["financialDetails.purchasePrice"] as string) || "",
              touched: form.isTouched("financialDetails.purchasePrice"),
            }}
          >
            <FormLabel htmlFor="purchasePrice" label="Purchase Price ($)" />
            <FormInput
              id="purchasePrice"
              name="financialDetails.purchasePrice"
              type="number"
              value={form.values.financialDetails.purchasePrice}
              onChange={handleOnChange}
              placeholder="Enter purchase price"
              min="0"
              hasError={!!form.errors["financialDetails.purchasePrice"]}
            />
          </FormField>
          <FormField
            error={{
              msg:
                (form.errors["financialDetails.purchaseDate"] as string) || "",
              touched: form.isTouched("financialDetails.purchaseDate"),
            }}
          >
            <FormLabel htmlFor="purchaseDate" label="Purchase Date" />
            <DatePicker
              id="purchaseDate"
              onChange={handleOnChange}
              placeholder="Select purchase date"
              name="financialDetails.purchaseDate"
              value={form.values.financialDetails.purchaseDate}
              hasError={!!form.errors["financialDetails.purchaseDate"]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg:
                (form.errors["financialDetails.marketValue"] as string) || "",
              touched: form.isTouched("financialDetails.marketValue"),
            }}
          >
            <FormLabel htmlFor="marketValue" label="Market Value ($)" />
            <FormInput
              id="marketValue"
              name="financialDetails.marketValue"
              type="number"
              value={form.values.financialDetails.marketValue}
              onChange={handleOnChange}
              placeholder="Enter current market value"
              min="0"
              hasError={!!form.errors["financialDetails.marketValue"]}
            />
          </FormField>
          <FormField
            error={{
              msg:
                (form.errors["financialDetails.propertyTax"] as string) || "",
              touched: form.isTouched("financialDetails.propertyTax"),
            }}
          >
            <FormLabel htmlFor="propertyTax" label="Property Tax ($)" />
            <FormInput
              id="propertyTax"
              name="financialDetails.propertyTax"
              type="number"
              value={form.values.financialDetails.propertyTax}
              onChange={handleOnChange}
              placeholder="Enter annual property tax"
              min="0"
              hasError={!!form.errors["financialDetails.propertyTax"]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg:
                (form.errors[
                  "financialDetails.lastAssessmentDate"
                ] as string) || "",
              touched: form.isTouched("financialDetails.lastAssessmentDate"),
            }}
          >
            <FormLabel
              htmlFor="lastAssessmentDate"
              label="Last Assessment Date"
            />
            <FormInput
              id="lastAssessmentDate"
              name="financialDetails.lastAssessmentDate"
              type="date"
              value={form.values.financialDetails.lastAssessmentDate}
              onChange={handleOnChange}
              placeholder="Select last assessment date"
              hasError={!!form.errors["financialDetails.lastAssessmentDate"]}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Property Address"
        description="Enter the complete address of the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address"] as string) || "",
              touched: form.isTouched("address"),
            }}
          >
            <FormLabel htmlFor="address" label="Street Address" required />
            <DebouncedInput
              id="address"
              name="address"
              type="text"
              value={form.values.address}
              onChange={handleOnChange}
              placeholder="Enter street address"
              debounceDelay={800}
              // validateFn={validateAddress}
              // onValidationComplete={handleAddressValidationComplete}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["unitApartment"] as string) || "",
              touched: form.isTouched("unitApartment"),
            }}
          >
            <FormLabel
              htmlFor="unitApartment"
              label="Unit/Apartment (optional)"
            />
            <FormInput
              id="unitApartment"
              name="unitApartment"
              type="text"
              value={form.values.unitApartment}
              onChange={handleOnChange}
              placeholder="Enter unit or apartment number"
              hasError={!!form.errors.unitApartment}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["city"] as string) || "",
              touched: form.isTouched("city"),
            }}
          >
            <FormLabel htmlFor="city" label="City" />
            <FormInput
              id="city"
              name="city"
              type="text"
              value={form.values.city}
              onChange={handleOnChange}
              placeholder="Enter city"
              hasError={!!form.errors.city}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="stateProvince" label="State/Province" />
            <FormInput
              id="stateProvince"
              name="stateProvince"
              type="text"
              value={form.values.stateProvince}
              onChange={handleOnChange}
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
              value={form.values.postalCode}
              onChange={handleOnChange}
              placeholder="Enter postal code"
              hasError={false}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="country" label="Country" />
            <Select
              id="country"
              name="country"
              value={form.values.country}
              onChange={handleOnChange}
              options={countryOptions}
              placeholder="Select country"
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
