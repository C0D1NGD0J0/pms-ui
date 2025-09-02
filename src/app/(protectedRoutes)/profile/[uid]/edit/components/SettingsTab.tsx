import React from "react";
import { FormSection } from "@components/FormLayout/formSection";
import {
  ToggleListItem,
  FormField,
  FormInput,
  FormLabel,
  Select,
} from "@components/FormElements";

interface SettingsTabProps {
  formData: any;
  handleInputChange: (section: string, field: string, value: any) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  formData,
  handleInputChange,
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
              value={formData.settings.theme}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange("settings", "theme", e.target.value)
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
              value={formData.settings.loginType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange("settings", "loginType", e.target.value)
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
              value={formData.profileMeta.timeZone}
              onChange={(e) =>
                handleInputChange("profileMeta", "timeZone", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="lang" label="Language" />
            <FormInput
              id="lang"
              name="lang"
              type="text"
              value={formData.profileMeta.lang}
              onChange={(e) =>
                handleInputChange("profileMeta", "lang", e.target.value)
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
              formData.settings.notifications[
                item.key as keyof typeof formData.settings.notifications
              ]
            }
            onChange={(newState) =>
              handleInputChange(
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
              value={formData.settings.gdprSettings.dataRetentionPolicy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange(
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
          initialState={formData.settings.gdprSettings.dataProcessingConsent}
          onChange={(newState) =>
            handleInputChange(
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