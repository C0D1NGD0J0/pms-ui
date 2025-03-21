/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import { CustomDropdown, FloatingLabelInput } from "@components/FormElements";
import { ISignupForm } from "@interfaces/auth.interface";
import { UseFormReturnType } from "@mantine/form";

const dropdownOptions = [
  { value: "apple", label: "Apple 🍎" },
  { value: "banana", label: "Banana 🍌" },
  { value: "orange", label: "Orange 🍊", disabled: true }, // Disabled option
  { value: "grape", label: "Grape 🍇" },
];

export default function UserInfo({
  formContext,
  onChange,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
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
          required
          id="firstName"
          name="firstName"
          label="First name"
          onChange={onChange}
          value={formContext.values.firstName}
          hasError={!!formContext.errors.firstName}
        />
        <FloatingLabelInput
          required
          id="lastName"
          name="lastName"
          label="Last name"
          onChange={onChange}
          value={formContext.values.lastName}
          hasError={!!formContext.errors.lastName}
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          required
          id="email"
          type="email"
          name="email"
          label="Email"
          onChange={onChange}
          value={formContext.values.email}
          hasError={!!formContext.errors.email}
        />
        <FloatingLabelInput
          required
          id="displayName"
          name="displayName"
          onChange={onChange}
          label="Display name"
          value={formContext.values.displayName}
          hasError={!!formContext.errors.displayName}
        />
      </div>

      <div className="form-fields">
        <CustomDropdown
          required
          id="location"
          onChange={(v) => {
            onChange(v, "location");
          }}
          options={dropdownOptions}
          placeholder="Select a location"
          value={formContext.values.location}
          hasError={!!formContext.errors.location}
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          required
          id="phoneNumber"
          name="phoneNumber"
          onChange={onChange}
          label="Phone number"
          value={formContext.values.phoneNumber}
          hasError={!!formContext.errors.phoneNumber}
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          required
          id="password"
          name="password"
          type="password"
          label="Password"
          onChange={onChange}
          value={formContext.values.password}
          hasError={!!formContext.errors.password}
        />

        <FloatingLabelInput
          required
          id="cpassword"
          type="password"
          name="cpassword"
          onChange={onChange}
          label="Confirm password"
          value={formContext.values.cpassword}
          hasError={!!formContext.errors.cpassword}
        />
      </div>

      <div className="form-fields">
        <CustomDropdown
          id="accountType"
          placeholder="Acount type"
          hasError={!!formContext.errors.accountType}
          value={formContext.values.accountType.planName}
          onChange={(v) => {
            const acctType = v === "corporate" ? "corporate" : "personal";
            formContext.setFieldValue("accountType", {
              planId: acctType,
              planName: acctType,
              isEnterpriseAccount: acctType === "corporate",
            });
          }}
          options={[
            { value: "personal", label: "Personal" },
            { value: "corporate", label: "Business" },
          ]}
        />
      </div>
    </>
  );
}
