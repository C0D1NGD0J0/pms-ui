"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import {
  EditPropertyFormValues,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  DebouncedInput,
  DatePicker,
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  form: UseFormReturnType<PropertyFormValues | EditPropertyFormValues>;
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
  console.log(form.errors, "error");
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
              required
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
              onChange={handleOnChange}
              options={propertyTypeOptions}
              placeholder="Select property type"
              value={form.values.propertyType || ""}
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
              onChange={handleOnChange}
              placeholder="Select status"
              options={propertyStatusOptions}
              value={form.values.status || ""}
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
            <DatePicker
              id="lastAssessmentDate"
              onChange={handleOnChange}
              placeholder="Select last assessment date"
              name="financialDetails.lastAssessmentDate"
              value={form.values.financialDetails.lastAssessmentDate}
              hasError={!!form.errors["financialDetails.lastAssessmentDate"]}
            />
          </FormField>
          <div style={{ width: "50%" }}></div>
        </div>
      </FormSection>

      <FormSection
        title="Property Address"
        description="Enter the complete address of the property"
      >
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address.fullAddress"] as string) || "",
              touched: form.isTouched("address.fullAddress"),
            }}
          >
            <FormLabel htmlFor="address" label="Street Address" required />
            {/* <DebouncedInput
              id="address"
              name="address.fullAddress"
              type="text"
              value={""}
              onChange={handleOnChange}
              placeholder="Enter street address"
              debounceDelay={800}
              // validateFn={validateAddress}
              // onValidationComplete={handleAddressValidationComplete}
            /> */}
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address.unitApartment"] as string) || "",
              touched: form.isTouched("address.unitApartment"),
            }}
          >
            <FormLabel
              htmlFor="unitApartment"
              label="Unit/Apartment (optional)"
            />
            <FormInput
              id="unitApartment"
              name="address.unitApartment"
              type="text"
              value={
                form.values.address.unitApartment ||
                form.values.address.fullAddress ||
                ""
              }
              onChange={handleOnChange}
              placeholder="Enter unit or apartment number"
              hasError={!!form.errors["address.unitApartment"]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["address.city"] as string) || "",
              touched: form.isTouched("address.city"),
            }}
          >
            <FormLabel htmlFor="city" label="City" />
            <FormInput
              disabled
              id="city"
              type="text"
              onChange={() => ""}
              name="address.city"
              placeholder="Enter city"
              value={form.values.address.city || ""}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="stateProvince" label="State/Province" />
            <FormInput
              disabled
              type="text"
              id="stateProvince"
              onChange={() => ""}
              name="address.state"
              value={form.values.address.state || ""}
              placeholder="Enter state/province"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="postalCode" label="Postal Code" />
            <FormInput
              disabled
              id="postalCode"
              name="address.postCode"
              type="text"
              value={form.values.address.postCode || ""}
              onChange={() => ""}
              placeholder="Enter postal code"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="country" label="Country" />
            <FormInput
              disabled
              type="text"
              id="country"
              onChange={() => ""}
              name="address.country"
              value={form.values.address.country || ""}
              placeholder="Enter country"
            />
          </FormField>
        </div>
      </FormSection>
    </>
  );
}
