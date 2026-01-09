"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { ISignupForm } from "@interfaces/auth.interface";
import { SIGNUP_ACCOUNT_TYPE_OPTIONS, ACCOUNT_TYPES } from "@utils/constants";
import {
  PasswordStrengthIndicator,
  CustomDropdown,
  AuthIconInput,
} from "@components/FormElements";

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <AuthIconInput
          label="First Name"
          type="text"
          icon="bx-user"
          placeholder="Enter first name"
          name="firstName"
          value={formContext.values.firstName}
          onChange={onChange}
          error={formContext.errors.firstName as string}
        />
        <AuthIconInput
          label="Last Name"
          type="text"
          icon="bx-user"
          placeholder="Enter last name"
          name="lastName"
          value={formContext.values.lastName}
          onChange={onChange}
          error={formContext.errors.lastName as string}
        />
      </div>

      <AuthIconInput
        label="Email Address"
        type="email"
        icon="bx-envelope"
        placeholder="Enter your email"
        name="email"
        value={formContext.values.email}
        onChange={onChange}
        error={formContext.errors.email as string}
        autoComplete="email"
      />

      <AuthIconInput
        label="Phone Number"
        type="tel"
        icon="bx-phone"
        placeholder="Enter phone number"
        name="phoneNumber"
        value={formContext.values.phoneNumber}
        onChange={onChange}
        error={formContext.errors.phoneNumber as string}
        autoComplete="tel"
      />

      <CustomDropdown
        id="accountType"
        placeholder="Select account type"
        errorMsg={formContext.errors.accountType}
        value={formContext.values.accountType.planName}
        onChange={(v) => {
          const acctType =
            v === ACCOUNT_TYPES.CORPORATE
              ? ACCOUNT_TYPES.CORPORATE
              : ACCOUNT_TYPES.PERSONAL;
          formContext.setFieldValue("accountType", {
            planId: acctType,
            planName: acctType,
            isCorporate: acctType === ACCOUNT_TYPES.CORPORATE,
          });
        }}
        options={SIGNUP_ACCOUNT_TYPE_OPTIONS}
      />

      <AuthIconInput
        label="Password"
        type="password"
        icon="bx-lock-alt"
        placeholder="Create a password"
        name="password"
        value={formContext.values.password}
        onChange={onChange}
        error={formContext.errors.password as string}
        autoComplete="new-password"
      />
      <PasswordStrengthIndicator password={formContext.values.password} />

      <AuthIconInput
        label="Confirm Password"
        type="password"
        icon="bx-lock-alt"
        placeholder="Confirm your password"
        name="cpassword"
        value={formContext.values.cpassword}
        onChange={onChange}
        error={formContext.errors.cpassword as string}
        autoComplete="new-password"
      />
    </>
  );
}
