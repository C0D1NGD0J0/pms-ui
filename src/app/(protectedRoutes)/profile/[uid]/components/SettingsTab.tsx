import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormSection } from "@components/FormLayout/formSection";
import { ProfileFormValues } from "@validations/profile.validations";
import {
  ToggleListItem,
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";

interface SettingsTabProps {
  profileForm: UseFormReturnType<ProfileFormValues>;
  handleOnChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string,
    field?: string
  ) => void;
  handleNestedChange: (section: string, field: string, value: any) => void;
  themeOptions: Array<{ value: string; label: string }>;
  loginTypeOptions: Array<{ value: string; label: string }>;
  dataRetentionOptions: Array<{ value: string; label: string }>;
  languageOptions: Array<{ value: string; label: string }>;
  timezoneOptions: Array<{ value: string; label: string }>;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  profileForm,
  handleOnChange,
  handleNestedChange,
  themeOptions,
  loginTypeOptions,
  dataRetentionOptions,
  languageOptions,
  timezoneOptions,
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
            <FormLabel htmlFor="timeZone" label="Time Zone" />
            <FormInput
              id="timeZone"
              name="timeZone"
              type="text"
              value={profileForm.values.settings.timeZone}
              onChange={(e) =>
                handleNestedChange("settings", "timeZone", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="lang" label="Language" />
            <FormInput
              id="lang"
              name="lang"
              type="text"
              value={profileForm.values.settings.lang}
              onChange={(e) =>
                handleNestedChange("settings", "lang", e.target.value)
              }
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
              handleNestedChange(
                "settings.notifications",
                item.key,
                newState
              )
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
            <FormLabel htmlFor="dataRetentionPolicy" label="Data Retention Policy" />
            <Select
              id="dataRetentionPolicy"
              name="dataRetentionPolicy"
              value={profileForm.values.settings.gdprSettings.dataRetentionPolicy}
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
          initialState={profileForm.values.settings.gdprSettings.dataProcessingConsent}
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