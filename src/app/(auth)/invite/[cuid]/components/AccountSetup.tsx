import React from "react";
import { IInvitationData } from "@src/interfaces";
import { AccountSetupFormValues } from "@src/validations/invitation.validations";
import {
  CustomDropdown,
  AuthIconInput,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements";

const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "en-ng", label: "English (Pidgin)" },
];

interface AccountSetupProps {
  invitationData: IInvitationData;
  onBack: () => void;
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  handleFieldChange: (
    field: keyof AccountSetupFormValues
  ) => (event: React.ChangeEvent<HTMLInputElement> | string) => void;
  handleDropdownChange: (
    value: string,
    field: keyof AccountSetupFormValues
  ) => void;
  isSubmitting: boolean;
  isValid: boolean;
  values: AccountSetupFormValues;
  errors: Record<string, React.ReactNode>;
  touched: (field: string) => boolean;
}

export const AccountSetup: React.FC<AccountSetupProps> = ({
  invitationData,
  onBack,
  handleSubmit,
  handleFieldChange,
  handleDropdownChange,
  isSubmitting,
  isValid,
  values,
  errors,
}) => {
  return (
    <Form onSubmit={handleSubmit} id="account-setup-form" autoComplete="off">
      <AuthIconInput
        label="Email Address"
        type="email"
        icon="bx-envelope"
        placeholder="Your email address"
        name="email"
        value={invitationData.inviteeEmail}
        disabled
        onChange={() => {}}
        autoComplete="email"
      />

      <AuthIconInput
        label="Password"
        type="password"
        icon="bx-lock-alt"
        placeholder="Create a password"
        name="password"
        value={values.password}
        onChange={handleFieldChange("password")}
        error={(errors.password as string) || ""}
        autoComplete="new-password"
      />

      <AuthIconInput
        label="Confirm Password"
        type="password"
        icon="bx-lock"
        placeholder="Confirm your password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleFieldChange("confirmPassword")}
        error={(errors.confirmPassword as string) || ""}
        autoComplete="new-password"
      />

      <AuthIconInput
        label="Phone Number"
        type="tel"
        icon="bx-phone"
        placeholder="Enter your phone number"
        name="phoneNumber"
        value={values.phoneNumber || ""}
        onChange={handleFieldChange("phoneNumber")}
        error={(errors.phoneNumber as string) || ""}
        autoComplete="tel"
      />

      <AuthIconInput
        label="Location"
        type="text"
        icon="bx-map"
        placeholder="Enter your location"
        name="location"
        value={values.location || ""}
        onChange={handleFieldChange("location")}
        error={(errors.location as string) || ""}
        autoComplete="address-level2"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
        <CustomDropdown
          id="timeZone"
          placeholder="Time Zone"
          value={values.timeZone}
          onChange={(value) => handleDropdownChange(value, "timeZone")}
          options={TIMEZONE_OPTIONS}
        />

        <CustomDropdown
          id="lang"
          placeholder="Language"
          value={values.lang}
          onChange={(value) => handleDropdownChange(value, "lang")}
          options={LANGUAGE_OPTIONS}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <Checkbox
          id="terms-checkbox"
          name="termsAccepted"
          checked={values.termsAccepted}
          onChange={handleFieldChange("termsAccepted")}
          label={
            <>
              I agree to the{" "}
              <a href="#" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </>
          }
        />
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "space-between" }}>
        <Button
          label="Back"
          className="btn btn-outline"
          onClick={onBack}
          icon={<i className="bx bx-arrow-back"></i>}
          disabled={isSubmitting}
        />
        <Button
          label={isSubmitting ? "Creating Account..." : "Create Account"}
          className="btn btn-primary"
          type="submit"
          icon={<i className="bx bx-user-plus"></i>}
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
        />
      </div>
    </Form>
  );
};
