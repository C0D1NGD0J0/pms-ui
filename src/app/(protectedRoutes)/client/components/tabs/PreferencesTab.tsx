"use client";

import React, { ChangeEvent, useState } from "react";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import {
  FormField,
  FormLabel,
  Button,
  Select,
  Toggle,
} from "@components/FormElements";

interface PreferencesTabProps {
  clientInfo: IClient;
}

export const PreferencesTab: React.FC<PreferencesTabProps> = ({
  clientInfo,
}) => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: clientInfo.settings.notificationPreferences.email,
    sms: clientInfo.settings.notificationPreferences.sms,
    inApp: clientInfo.settings.notificationPreferences.inApp,
  });

  const [regionalSettings, setRegionalSettings] = useState({
    timeZone: clientInfo.settings.timeZone,
    lang: clientInfo.settings.lang,
  });

  const handleToggleChange = (setting: string, newState: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: newState,
    }));
  };

  const handleRegionalChange = (name: string, value: string) => {
    setRegionalSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
            initialState={notificationSettings.email}
            onChange={(newState) => handleToggleChange("email", newState)}
            name="emailNotifications"
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>SMS Notifications</h4>
            <p>Receive notifications via SMS</p>
          </div>
          <Toggle
            initialState={notificationSettings.sms}
            onChange={(newState) => handleToggleChange("sms", newState)}
            name="smsNotifications"
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>In-App Notifications</h4>
            <p>Show notifications within the application</p>
          </div>
          <Toggle
            initialState={notificationSettings.inApp}
            onChange={(newState) => handleToggleChange("inApp", newState)}
            name="inAppNotifications"
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
              name="timeZone"
              value={regionalSettings.timeZone}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleRegionalChange("timeZone", e.target.value)
              }
              options={[
                { value: "UTC", label: "UTC (Coordinated Universal Time)" },
                { value: "America/New_York", label: "Eastern Time (ET)" },
                { value: "America/Chicago", label: "Central Time (CT)" },
                { value: "America/Denver", label: "Mountain Time (MT)" },
                { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
                { value: "Europe/London", label: "London (GMT)" },
                { value: "Europe/Paris", label: "Paris (CET)" },
                { value: "Asia/Tokyo", label: "Tokyo (JST)" },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="language" label="Language" />
            <Select
              id="language"
              name="language"
              value={regionalSettings.lang}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleRegionalChange("lang", e.target.value)
              }
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "it", label: "Italian" },
                { value: "pt", label: "Portuguese" },
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
