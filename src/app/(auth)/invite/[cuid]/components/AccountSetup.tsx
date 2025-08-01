import React, { useState } from "react";
import {
  FloatingLabelInput,
  CustomDropdown,
  FormField,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements";

import { MockInvitationData } from "../../mockData";

// Timezone options
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

// Language options
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "en-ng", label: "English (Pidgin)" },
];

interface AccountSetupProps {
  invitationData: MockInvitationData;
  onBack: () => void;
  onNext: () => void;
}

export const AccountSetup: React.FC<AccountSetupProps> = ({
  invitationData,
  onBack,
  onNext,
}) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    termsAccepted: false,
    newsletterOptIn: false,
    location: "",
    timeZone: "UTC",
    lang: "en",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle dropdown changes
  const handleDropdownChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted =
        "You must agree to the Terms of Service and Privacy Policy";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      id="account-setup-form"
      className="auth-form"
      autoComplete="off"
    >
      <div className="form-fields">
        <FormField>
          <FloatingLabelInput
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={invitationData.inviteeEmail}
            disabled
            onChange={() => {}} // Empty function since it's disabled
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: errors.password || "",
            touched: !!formData.password || !!errors.password,
          }}
        >
          <FloatingLabelInput
            required
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            errorMsg={errors.password}
            onChange={(e) =>
              handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormField>

        <FormField
          error={{
            msg: errors.confirmPassword || "",
            touched: !!formData.confirmPassword || !!errors.confirmPassword,
          }}
        >
          <FloatingLabelInput
            required
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            errorMsg={errors.confirmPassword}
            onChange={(e) =>
              handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <FloatingLabelInput
            id="phoneNumber"
            name="phoneNumber"
            type="text"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) =>
              handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormField>

        <FormField>
          <FloatingLabelInput
            id="location"
            name="location"
            type="text"
            label="Location"
            value={formData.location}
            onChange={(e) =>
              handleInputChange(e as React.ChangeEvent<HTMLInputElement>)
            }
          />
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <CustomDropdown
            id="timeZone"
            placeholder="Time Zone"
            value={formData.timeZone}
            onChange={(value) => handleDropdownChange(value, "timeZone")}
            options={TIMEZONE_OPTIONS}
          />
        </FormField>

        <FormField>
          <CustomDropdown
            id="lang"
            placeholder="Language"
            value={formData.lang}
            onChange={(value) => handleDropdownChange(value, "lang")}
            options={LANGUAGE_OPTIONS}
          />
        </FormField>
      </div>

      <div className="form-fields m-2">
        <FormField
          error={{
            msg: errors.termsAccepted || "",
            touched: !!errors.termsAccepted,
          }}
        >
          <Checkbox
            id="terms-checkbox"
            name="termsAccepted"
            required
            checked={formData.termsAccepted}
            onChange={handleInputChange}
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
        />
        <Button
          label="Create Account"
          className="btn btn-primary"
          type="submit"
          icon={<i className="bx bx-user-plus"></i>}
        />
      </div>
    </Form>
  );
};
