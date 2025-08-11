import React from "react";
import { IInvitationData } from "@src/interfaces";
import { AccountSetupFormValues } from "@src/validations/invitation.validations";
import {
  CustomDropdown,
  FormField,
  FormInput,
  FormLabel,
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
  touched,
}) => {
  return (
    <Form onSubmit={handleSubmit} id="account-setup-form" autoComplete="off">
      <div className="form-fields mb-2">
        <FormField>
          <FormLabel htmlFor="email" label="Email Address" />
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={invitationData.inviteeEmail}
            disabled
            onChange={() => {}}
          />
        </FormField>
      </div>

      <div className="form-fields mb-2">
        <FormField
          error={{
            msg: (errors.password as string) || "",
            touched: touched("password"),
          }}
        >
          <FormLabel htmlFor="password" label="Password" required />
          <FormInput
            required
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            hasError={!!errors.password}
            onChange={handleFieldChange("password")}
          />
        </FormField>

        <FormField
          error={{
            msg: (errors.confirmPassword as string) || "",
            touched: touched("confirmPassword"),
          }}
        >
          <FormLabel
            htmlFor="confirmPassword"
            label="Confirm Password"
            required
          />
          <FormInput
            required
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={values.confirmPassword}
            hasError={!!errors.confirmPassword}
            onChange={handleFieldChange("confirmPassword")}
          />
        </FormField>
      </div>

      <div className="form-fields mb-2">
        <FormField
          error={{
            msg: (errors.phoneNumber as string) || "",
            touched: touched("phoneNumber"),
          }}
        >
          <FormLabel htmlFor="phoneNumber" label="Phone Number" />
          <FormInput
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            placeholder="Enter your phone number"
            value={values.phoneNumber || ""}
            hasError={!!errors.phoneNumber}
            onChange={handleFieldChange("phoneNumber")}
          />
        </FormField>

        <FormField
          error={{
            msg: (errors.location as string) || "",
            touched: touched("location"),
          }}
        >
          <FormLabel htmlFor="location" label="Location" />
          <FormInput
            id="location"
            name="location"
            type="text"
            placeholder="Enter your location"
            value={values.location || ""}
            hasError={!!errors.location}
            onChange={handleFieldChange("location")}
          />
        </FormField>
      </div>

      <div className="form-fields mb-2">
        <FormField>
          <CustomDropdown
            id="timeZone"
            placeholder="Time Zone"
            value={values.timeZone}
            onChange={(value) => handleDropdownChange(value, "timeZone")}
            options={TIMEZONE_OPTIONS}
          />
        </FormField>

        <FormField>
          <CustomDropdown
            id="lang"
            placeholder="Language"
            value={values.lang}
            onChange={(value) => handleDropdownChange(value, "lang")}
            options={LANGUAGE_OPTIONS}
          />
        </FormField>
      </div>

      <div className="form-fields mb-2">
        <FormField>
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
        </FormField>
      </div>

      <div className="flex-row row-gap flex-between">
        <Button
          label="Back"
          className="btn btn-outline"
          onClick={onBack}
          icon={<i className="bx bx-arrow-back"></i>}
          disabled={isValid || isSubmitting}
        />
        <Button
          label={isSubmitting ? "Creating Account..." : "Create Account"}
          className="btn btn-primary"
          type="submit"
          icon={<i className="bx bx-user-plus"></i>}
          disabled={!isValid || isSubmitting}
        />
      </div>
    </Form>
  );
};
