/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React from "react";
import {
  CustomDropdown,
  FloatingLabelInput,
  TypeaheadInput,
} from "@components/FormElements";
import { ISignupForm } from "@interfaces/auth.interface";
import { UseFormReturnType } from "@mantine/form";
import { ACCOUNT_TYPES, SIGNUP_ACCOUNT_TYPE_OPTIONS } from "@utils/constants";
import country from "country-list-js";

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
          errorMsg={formContext.errors.firstName}
        />
        <FloatingLabelInput
          required
          id="lastName"
          name="lastName"
          label="Last name"
          onChange={onChange}
          value={formContext.values.lastName}
          errorMsg={formContext.errors.lastName}
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
          errorMsg={formContext.errors.email}
        />
        <FloatingLabelInput
          required
          id="displayName"
          name="displayName"
          onChange={onChange}
          label="Display name"
          value={formContext.values.displayName}
          errorMsg={formContext.errors.displayName}
        />
      </div>

      <div className="form-fields">
        <FloatingLabelInput
          required
          id="location"
          name="location"
          onChange={onChange}
          label="Phone number"
          value={formContext.values.location}
          errorMsg={formContext.errors.location}
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
          errorMsg={formContext.errors.phoneNumber}
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
          errorMsg={formContext.errors.password}
        />

        <FloatingLabelInput
          required
          id="cpassword"
          type="password"
          name="cpassword"
          onChange={onChange}
          label="Confirm password"
          value={formContext.values.cpassword}
          errorMsg={formContext.errors.cpassword}
        />
      </div>

      <div className="form-fields">
        <CustomDropdown
          id="accountType"
          placeholder="Acount type"
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
      </div>
    </>
  );
}
