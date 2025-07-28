import React, { useState } from "react";
import {
  FloatingLabelInput,
  FormField,
  Checkbox,
  Button,
  Form,
} from "@components/FormElements";

import { MockInvitationData } from "../../mockData";

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
