/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { FloatingLabelInput } from "@components/FormElements";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function CompanyInfo() {
  const nextStep = () => {};

  const prevStep = () => {};

  return (
    <>
      <div className="form-fields">
        <FloatingLabelInput
          id="legalEntityName"
          name="legalEntityName"
          value=""
          onChange={() => {}}
          label="Registered name"
          required
        />
        <FloatingLabelInput
          id="tradingName"
          name="tradingName"
          value=""
          onChange={() => {}}
          label="Trading name"
          required
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="companyEmail"
          name="companyEmail"
          value=""
          onChange={() => {}}
          label="Business Email"
          type="email"
          required
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="contactNumber"
          name="contactNumber"
          value=""
          onChange={() => {}}
          label="Business phone number"
          required
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          id="companyWebsite"
          name="companyWebsite"
          value=""
          onChange={() => {}}
          required={false}
          label="Business website"
        />
      </div>
    </>
  );
}
