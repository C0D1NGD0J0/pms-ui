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
            initialState={clientInfo.settings.notificationPreferences.email}
            onChange={(newState) => handleToggleChange("email", newState)}
            name="settings.notificationPreferences.email"
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>SMS Notifications</h4>
            <p>Receive notifications via SMS</p>
          </div>
          <Toggle
            name="settings.notificationPreferences.sms"
            onChange={(newState) => handleToggleChange("sms", newState)}
            initialState={clientInfo.settings.notificationPreferences.sms}
          />
        </div>

        <div className="toggle-container">
          <div className="toggle-label">
            <h4>In-App Notifications</h4>
            <p>Show notifications within the application</p>
          </div>
          <Toggle
            initialState={clientInfo.settings.notificationPreferences.inApp}
            onChange={(newState) => handleToggleChange("inApp", newState)}
            name="settings.notificationPreferences.inApp"
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
              value={clientInfo.settings.timeZone}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleRegionalChange("timeZone", e.target.value)
              }
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
              value={clientInfo.settings.lang}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleRegionalChange("lang", e.target.value)
              }
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
