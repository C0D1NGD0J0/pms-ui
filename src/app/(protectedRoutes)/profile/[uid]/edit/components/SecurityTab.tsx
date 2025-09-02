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
  const [securityForm, setSecurityForm] = React.useState({
    currentPassword: "",
    newEmail: formData.userInfo.email || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSecurityChange = (field: string, value: string) => {
    setSecurityForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Also update the main form data for email
    if (field === "newEmail") {
      handleInputChange("userInfo", "email", value);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleUpdateSecurity = () => {
    // TODO: Implement security update API call
    if (!securityForm.currentPassword) {
      alert("Current password is required to make security changes");
      return;
    }

    // Check if user is updating password
    if (securityForm.newPassword || securityForm.confirmPassword) {
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        alert("New passwords don't match");
        return;
      }
      if (securityForm.newPassword.length < 8) {
        alert("New password must be at least 8 characters");
        return;
      }
    }

    // Check if any changes were made
    const emailChanged = securityForm.newEmail !== formData.userInfo.email;
    const passwordChanged = securityForm.newPassword.length > 0;

    if (!emailChanged && !passwordChanged) {
      alert("No changes to save");
      return;
    }

    console.log("Update security:", {
      currentPassword: securityForm.currentPassword,
      emailChanged,
      passwordChanged,
      newEmail: emailChanged ? securityForm.newEmail : undefined,
      newPassword: passwordChanged ? securityForm.newPassword : undefined,
    });
  };

  const hasChanges = () => {
    const emailChanged = securityForm.newEmail !== formData.userInfo.email;
    const passwordChanged = securityForm.newPassword.length > 0;
    return emailChanged || passwordChanged;
  };

  const isFormValid = () => {
    const hasCurrentPassword = securityForm.currentPassword.length > 0;
    const passwordsMatch = securityForm.newPassword === securityForm.confirmPassword;
    const passwordLengthValid = securityForm.newPassword.length === 0 || securityForm.newPassword.length >= 8;
    
    return hasCurrentPassword && hasChanges() && passwordsMatch && passwordLengthValid;
  };

  return (
    <div className="resource-form">
      <FormSection
        title="Account Security"
        description="Update your email address or password. Current password required for all changes."
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="userEmail" label="Email Address" />
            <FormInput
              id="userEmail"
              name="userEmail"
              type="email"
              value={securityForm.newEmail}
              onChange={(e) => handleSecurityChange("newEmail", e.target.value)}
              placeholder="Enter email address"
            />
          </FormField>
          
          <FormField>
            <FormLabel htmlFor="currentPassword" label="Current Password *" />
            <div className="password-input-wrapper">
              <FormInput
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={securityForm.currentPassword}
                onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                placeholder="Required to save any changes"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("current")}
              >
                <i className={`bx ${showPasswords.current ? "bx-hide" : "bx-show"}`}></i>
              </button>
            </div>
          </FormField>
        </div>
        
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="newPassword" label="New Password (Optional)" />
            <div className="password-input-wrapper">
              <FormInput
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={securityForm.newPassword}
                onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                placeholder="Leave blank to keep current password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("new")}
              >
                <i className={`bx ${showPasswords.new ? "bx-hide" : "bx-show"}`}></i>
              </button>
            </div>
          </FormField>
          
          <FormField>
            <FormLabel htmlFor="confirmPassword" label="Confirm New Password" />
            <div className="password-input-wrapper">
              <FormInput
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={securityForm.confirmPassword}
                onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                placeholder="Confirm new password"
                disabled={!securityForm.newPassword}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={!securityForm.newPassword}
              >
                <i className={`bx ${showPasswords.confirm ? "bx-hide" : "bx-show"}`}></i>
              </button>
            </div>
          </FormField>
        </div>

        <div className="form-actions">
          <Button
            type="button"
            label="Update Security Settings"
            className="btn btn-primary"
            icon={<i className="bx bx-shield-check"></i>}
            onClick={handleUpdateSecurity}
            disabled={!isFormValid()}
          />
        </div>
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