"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout";
import {
  EditPropertyFormValues,
  PropertyFormValues,
} from "@interfaces/property.interface";
import {
  DatePicker,
  FormField,
  FormLabel,
  FormInput,
  Select,
} from "@components/FormElements";

interface Props {
  currencyOptions: { value: string; label: string }[];
  form: UseFormReturnType<PropertyFormValues | EditPropertyFormValues>;
  handleOnChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => void;
}

export function FinancialTab({ form, handleOnChange, currencyOptions }: Props) {
  return (
    <>
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

      <FormSection title="Fees" description="Set up fees for the property">
        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["fees.currency"] as string) || "",
              touched: form.isTouched("fees.currency"),
            }}
          >
            <FormLabel htmlFor="currency" label="Currency" />
            <Select
              id="currency"
              name="fees.currency"
              onChange={handleOnChange}
              options={currencyOptions}
              placeholder="Select currency"
              value={form.values.fees?.currency || "USD"}
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["fees.rentalAmount"] as string) || "",
              touched: form.isTouched("fees.rentalAmount"),
            }}
          >
            <FormLabel htmlFor="rentalAmount" label="Rental Amount" />
            <FormInput
              id="rentalAmount"
              name="fees.rentalAmount"
              type="text"
              value={form.values.fees?.rentalAmount || "0.00"}
              onChange={handleOnChange}
              placeholder="Enter rental amount"
              hasError={!!form.errors["fees.rentalAmount"]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["fees.taxAmount"] as string) || "",
              touched: form.isTouched("fees.taxAmount"),
            }}
          >
            <FormLabel htmlFor="taxAmount" label="Tax Amount" />
            <FormInput
              id="taxAmount"
              name="fees.taxAmount"
              type="text"
              value={form.values.fees?.taxAmount || "0.00"}
              onChange={handleOnChange}
              placeholder="Enter tax amount"
              hasError={!!form.errors["fees.taxAmount"]}
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["fees.managementFees"] as string) || "",
              touched: form.isTouched("fees.managementFees"),
            }}
          >
            <FormLabel htmlFor="managementFees" label="Management Fees" />
            <FormInput
              id="managementFees"
              name="fees.managementFees"
              type="text"
              value={form.values.fees?.managementFees || "0.00"}
              onChange={handleOnChange}
              placeholder="Enter management fees"
              hasError={!!form.errors["fees.managementFees"]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField
            error={{
              msg: (form.errors["fees.securityDeposit"] as string) || "",
              touched: form.isTouched("fees.securityDeposit"),
            }}
          >
            <FormLabel htmlFor="securityDeposit" label="Security Deposit" />
            <FormInput
              id="securityDeposit"
              name="fees.securityDeposit"
              type="text"
              value={form.values.fees?.securityDeposit || "0.00"}
              onChange={handleOnChange}
              placeholder="Enter security deposit"
              hasError={!!form.errors["fees.securityDeposit"]}
            />
          </FormField>
          <div style={{ width: "50%" }}></div>
        </div>
      </FormSection>
    </>
  );
}
