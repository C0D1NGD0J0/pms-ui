import React from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormInput,
  FormLabel,
  Button,
} from "@components/FormElements";

interface SecurityTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  formData,
  handleInputChange,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="Account Security"
        description="Manage your account security settings"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="userEmail" label="Email Address" />
            <FormInput
              id="userEmail"
              name="userEmail"
              type="email"
              value={formData.userInfo.email}
              onChange={(e) =>
                handleInputChange("userInfo", "email", e.target.value)
              }
            />
          </FormField>
        </div>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.5rem" }}>
          Note: Password updates should be handled separately via password reset flow
        </p>
      </FormSection>

      <FormSection
        title="Danger Zone"
        description="Irreversible account actions"
      >
        <div className="form-actions">
          <Button
            type="button"
            label="Delete Account"
            className="btn btn-danger"
            icon={<i className="bx bx-trash"></i>}
          />
        </div>
      </FormSection>
    </div>
  );
};