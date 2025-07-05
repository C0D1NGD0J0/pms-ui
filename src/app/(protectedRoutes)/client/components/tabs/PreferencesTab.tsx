"use client";

import React, { ChangeEvent } from "react";
import { UseFormReturnType } from "@mantine/form";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { UpdateClientDetailsFormData } from "@src/validations/client.validations";
import {
  FormField,
  FormLabel,
  Button,
  Select,
  Toggle,
} from "@components/FormElements";

interface PreferencesTabProps {
  clientInfo: IClient;
  inEditMode: boolean;
  clientForm?: UseFormReturnType<UpdateClientDetailsFormData>;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  clientInfo,
  inEditMode = false,
  clientForm,
}) => {
  const form = clientForm;
  const isEditMode = !!clientForm;

  const handleToggleChange = (setting: string, newState: boolean) => {
    if (form && form.values.settings) {
      const currentSettings = form.values.settings;
      form.setFieldValue("settings", {
        ...currentSettings,
        notificationPreferences: {
          email: currentSettings.notificationPreferences?.email ?? false,
          sms: currentSettings.notificationPreferences?.sms ?? false,
          inApp: currentSettings.notificationPreferences?.inApp ?? false,
          [setting]: newState,
        },
      });
    }
  };

  const handleRegionalChange = (name: string, value: string) => {
    if (form && form.values.settings) {
      const currentSettings = form.values.settings;
      form.setFieldValue("settings", {
        ...currentSettings,
        [name]: value,
      });
    }
  };

  const currentNotificationPreferences = isEditMode
    ? {
        email:
          form?.values.settings?.notificationPreferences?.email ??
          clientInfo.settings.notificationPreferences.email,
        sms:
          form?.values.settings?.notificationPreferences?.sms ??
          clientInfo.settings.notificationPreferences.sms,
        inApp:
          form?.values.settings?.notificationPreferences?.inApp ??
          clientInfo.settings.notificationPreferences.inApp,
      }
    : clientInfo.settings.notificationPreferences;

  const currentTimeZone = isEditMode
    ? form?.values.settings?.timeZone || clientInfo.settings.timeZone
    : clientInfo.settings.timeZone;

  const currentLang = isEditMode
    ? form?.values.settings?.lang || clientInfo.settings.lang
    : clientInfo.settings.lang;

  return (
    <div className="resource-form">
      <FormSection
        title="Notification Preferences"
        description="Configure how you receive notifications and alerts"
      >
        <div className="toggle-container">
          <div className="toggle-label">
            <h4>Email Notifications</h4>
            <p>Receive notifications via email</p>
          </div>
          <Toggle
            initialState={currentNotificationPreferences.email}
            onChange={(newState) =>
              isEditMode ? handleToggleChange("email", newState) : void 0
            }
            name="settings.notificationPreferences.email"
            disabled={!isEditMode}
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>SMS Notifications</h4>
            <p>Receive notifications via SMS</p>
          </div>
          <Toggle
            name="settings.notificationPreferences.sms"
            onChange={(newState) =>
              isEditMode ? handleToggleChange("sms", newState) : void 0
            }
            initialState={currentNotificationPreferences.sms}
            disabled={!isEditMode}
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>In-App Notifications</h4>
            <p>Show notifications within the application</p>
          </div>
          <Toggle
            initialState={currentNotificationPreferences.inApp}
            onChange={(newState) =>
              isEditMode ? handleToggleChange("inApp", newState) : void 0
            }
            name="settings.notificationPreferences.inApp"
            disabled={!isEditMode}
          />
        </div>
      </FormSection>

      <FormSection
        title="Regional Settings"
        description="Configure timezone and language preferences"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="timeZone" label="Timezone" />
            <Select
              id="timeZone"
              name="settings.timeZone"
              value={currentTimeZone}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                isEditMode
                  ? handleRegionalChange("timeZone", e.target.value)
                  : void 0
              }
              disabled={!isEditMode}
              options={[
                { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                { value: "EST", label: "Eastern Time (ET)" },
                { value: "CST", label: "Central Time (CT)" },
                { value: "MT", label: "Mountain Time (MT)" },
                { value: "PST", label: "Pacific Time (PT)" },
                { value: "GMT", label: "London (GMT)" },
                { value: "CET", label: "Paris (CET)" },
                { value: "JST", label: "Tokyo (JST)" },
                { value: "WAT", label: "West Africa Time (WAT)" },
                { value: "EAT", label: "East Africa Time (EAT)" },
                { value: "IST", label: "India Standard Time (IST)" },
                { value: "CST", label: "China Standard Time (CST)" },
                {
                  value: "AEST",
                  label: "Australian Eastern Standard Time (AEST)",
                },
                { value: "NZST", label: "New Zealand Standard Time (NZST)" },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="language" label="Language" />
            <Select
              id="language"
              name="settings.language"
              value={currentLang}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                isEditMode
                  ? handleRegionalChange("lang", e.target.value)
                  : void 0
              }
              disabled={!isEditMode}
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "en(NIG)", label: "Pidgin English" },
              ]}
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Account Actions"
        description="Manage your account status and data"
      >
        <div className="form-actions">
          <Button
            label="Delete Account"
            className="btn-danger"
            icon={<i className="bx bx-trash"></i>}
          />
          <Button
            label="Export Data"
            className="btn-outline"
            icon={<i className="bx bx-download"></i>}
          />
        </div>
      </FormSection>
    </div>
  );
};
