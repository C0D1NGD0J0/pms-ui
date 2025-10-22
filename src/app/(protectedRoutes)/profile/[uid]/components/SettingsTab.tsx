import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout/formSection";
import { ProfileFormValues } from "@validations/profile.validations";
import {
  ToggleListItem,
  FormField,
  FormLabel,
  Select,
} from "@components/FormElements";

interface SettingsTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleNestedChange: (section: string, field: string, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profileForm,
  handleNestedChange,
}) => {
  return (
    <div className="resource-form">
      <FormSection
        title="App Settings"
        description="Configure your application preferences"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="theme" label="Theme" />
            <Select
              id="theme"
              name="theme"
              value={profileForm.values.settings.theme}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange("settings", "theme", e.target.value)
              }
              options={[
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="loginType" label="Login Type" />
            <Select
              id="loginType"
              name="loginType"
              value={profileForm.values.settings.loginType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange("settings", "loginType", e.target.value)
              }
              options={[
                { value: "password", label: "Password" },
                { value: "otp", label: "OTP" },
              ]}
            />
          </FormField>
        </div>
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="lang" label="Language" />
            <Select
              id="lang"
              name="lang"
              value={profileForm.values.settings.lang}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange("settings", "lang", e.target.value)
              }
              options={[
                { value: "en", label: "English" },
                { value: "fr", label: "French" },
                { value: "en-nig", label: "English (Nigeria)" },
              ]}
              placeholder="Select language"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="timeZone" label="Time Zone" />
            <Select
              id="timeZone"
              name="timeZone"
              value={profileForm.values.settings.timeZone}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange("settings", "timeZone", e.target.value)
              }
              options={[
                { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                {
                  value: "America/New_York",
                  label: "Eastern Time (US & Canada)",
                },
                {
                  value: "America/Chicago",
                  label: "Central Time (US & Canada)",
                },
                {
                  value: "America/Denver",
                  label: "Mountain Time (US & Canada)",
                },
                {
                  value: "America/Los_Angeles",
                  label: "Pacific Time (US & Canada)",
                },
                { value: "America/Toronto", label: "Toronto" },
                { value: "Europe/London", label: "London" },
                { value: "Europe/Paris", label: "Paris" },
                { value: "Europe/Berlin", label: "Berlin" },
                { value: "Asia/Dubai", label: "Dubai" },
                { value: "Asia/Tokyo", label: "Tokyo" },
                { value: "Asia/Shanghai", label: "Shanghai" },
                { value: "Asia/Singapore", label: "Singapore" },
                { value: "Australia/Sydney", label: "Sydney" },
                { value: "Pacific/Auckland", label: "Auckland" },
              ]}
              placeholder="Select timezone"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Notifications"
        description="Configure your notification preferences"
      >
        {[
          {
            key: "messages",
            title: "Messages",
            description: "Receive notifications for new messages",
            icon: "bx-message-dots",
          },
          {
            key: "comments",
            title: "Comments",
            description: "Get notified about comments on your posts",
            icon: "bx-comment",
          },
          {
            key: "announcements",
            title: "Announcements",
            description: "Receive system announcements",
            icon: "bx-bell",
          },
        ].map((item) => (
          <ToggleListItem
            key={item.key}
            title={item.title}
            description={item.description}
            icon={item.icon}
            initialState={
              profileForm.values.settings.notifications[
                item.key as keyof typeof profileForm.values.settings.notifications
              ]
            }
            onChange={(newState) =>
              handleNestedChange("settings.notifications", item.key, newState)
            }
            name={`settings.notifications.${item.key}`}
          />
        ))}
      </FormSection>

      <FormSection
        title="GDPR Settings"
        description="Manage your data privacy preferences"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="dataRetentionPolicy"
              label="Data Retention Policy"
            />
            <Select
              id="dataRetentionPolicy"
              name="dataRetentionPolicy"
              value={
                profileForm.values.settings.gdprSettings.dataRetentionPolicy
              }
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleNestedChange(
                  "settings.gdprSettings",
                  "dataRetentionPolicy",
                  e.target.value
                )
              }
              options={[
                { value: "standard", label: "Standard" },
                { value: "extended", label: "Extended" },
                { value: "minimal", label: "Minimal" },
              ]}
            />
          </FormField>
        </div>

        <ToggleListItem
          title="Data Processing Consent"
          description="I consent to the processing of my personal data"
          icon="bx-shield-check"
          initialState={
            profileForm.values.settings.gdprSettings.dataProcessingConsent
          }
          onChange={(newState) =>
            handleNestedChange(
              "settings.gdprSettings",
              "dataProcessingConsent",
              newState
            )
          }
          name="settings.gdprSettings.dataProcessingConsent"
        />
      </FormSection>
    </div>
  );
};
