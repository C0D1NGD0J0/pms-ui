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
          errorMsg={formContext.errors["companyProfile.legalEntityName"]}
          label="Registered name"
          required
        />
        <FloatingLabelInput
          required
          id="tradingName"
          name="tradingName"
          onChange={onChange}
          label="Trading name"
          value={formContext.values.companyProfile?.tradingName || ""}
          errorMsg={formContext.errors["companyProfile.tradingName"]}
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="companyEmail"
          name="companyProfile.companyEmail"
          onChange={onChange}
          value={formContext.values.companyProfile?.companyEmail || ""}
          errorMsg={formContext.errors["companyProfile.companyEmail"]}
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
          errorMsg={formContext.errors["companyProfile.companyPhone"]}
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
          errorMsg={formContext.errors["companyProfile.website"]}
          required={false}
          label="Business website"
        />
      </div>
    </>
  );
}
