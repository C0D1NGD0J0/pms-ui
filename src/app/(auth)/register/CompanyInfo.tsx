/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { ISignupForm } from "@interfaces/auth.interface";
import { FloatingLabelInput } from "@components/FormElements";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function CompanyInfo({
  formContext,
  onChange,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => void;
  formContext: UseFormReturnType<
    ISignupForm,
    (values: ISignupForm) => ISignupForm
  >;
}) {
  return (
    <>
      <div className="form-fields">
        <FloatingLabelInput
          id="legalEntityName"
          name="companyProfile.legalEntityName"
          onChange={onChange}
          value={formContext.values.companyProfile?.legalEntityName || ""}
          hasError={
            !!(formContext.errors.companyProfile as any)?.legalEntityName ||
            false
          }
          label="Registered name"
          required
        />
        <FloatingLabelInput
          required
          id="tradingName"
          name="companyProfile.tradingName"
          onChange={onChange}
          label="Trading name"
          value={formContext.values.companyProfile?.tradingName || ""}
          hasError={
            !!(formContext.errors.companyProfile as any)?.tradingName || false
          }
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="companyEmail"
          name="companyProfile.companyEmail"
          onChange={onChange}
          value={formContext.values.companyProfile?.companyEmail || ""}
          hasError={
            !!(formContext.errors.companyProfile as any)?.companyEmail || false
          }
          label="Business Email"
          type="email"
          required
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="companyPhone"
          name="companyProfile.companyPhone"
          onChange={onChange}
          value={formContext.values.companyProfile?.companyPhone || ""}
          hasError={
            !!(formContext.errors.companyProfile as any)?.companyPhone || false
          }
          label="Business phone number"
          required
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="website"
          name="companyProfile.website"
          onChange={onChange}
          value={formContext.values.companyProfile?.website || ""}
          hasError={
            !!(formContext.errors.companyProfile as any)?.website || false
          }
          required={false}
          label="Business website"
        />
      </div>
    </>
  );
}
