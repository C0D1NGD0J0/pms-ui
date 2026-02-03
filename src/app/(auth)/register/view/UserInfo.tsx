"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { useGeolocation } from "@hooks/useGeolocation";
import { useNotification } from "@hooks/useNotification";
import { ISignupForm } from "@interfaces/auth.interface";
import {
  PasswordStrengthIndicator,
  FieldActionButton,
  AuthIconInput,
} from "@components/FormElements";

export default function UserInfo({
  formContext,
  onChange,
  onChangePlan,
  selectedPlan,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string,
    field?: keyof ISignupForm
  ) => void;
  formContext: UseFormReturnType<
    ISignupForm,
    (values: ISignupForm) => ISignupForm
  >;
  onChangePlan?: () => void;
  selectedPlan?: string | null;
}) {
  const { detectLocation, isDetecting } = useGeolocation();
  const { message } = useNotification();

  const handleDetectLocation = async () => {
    try {
      const location = await detectLocation();
      onChange(location, "location");
    } catch (error) {
      message.error(
        error instanceof Error
          ? error.message
          : "Could not detect location. Please enter manually."
      );
    }
  };

  return (
    <>
      <div className="auth-form-grid">
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

      <div className="auth-field-with-action">
        <AuthIconInput
          label="Location"
          type="text"
          icon="bx-map"
          placeholder="City, State"
          name="location"
          value={formContext.values.location}
          onChange={onChange}
          error={formContext.errors.location as string}
        />
        <FieldActionButton
          onClick={handleDetectLocation}
          disabled={isDetecting}
          icon={isDetecting ? "bx-loader bx-spin" : "bx-current-location"}
          label={isDetecting ? "Detecting..." : "Detect"}
        />
      </div>

      <div className="auth-field-with-action">
        <AuthIconInput
          label="Account Type"
          type="text"
          icon="bx-briefcase"
          placeholder="Select a plan"
          name="accountType"
          value={
            selectedPlan
              ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)
              : ""
          }
          onChange={() => {}}
          disabled={true}
          error={
            formContext.errors.accountType
              ? String(formContext.errors.accountType)
              : undefined
          }
        />
        {onChangePlan && (
          <FieldActionButton onClick={onChangePlan} label="Change Plan" />
        )}
      </div>

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
