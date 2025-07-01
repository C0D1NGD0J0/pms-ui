"use client";

import React, { useState } from "react";
import { TabList } from "@components/Tab/components";

import { CompanyTab } from "./tabs/CompanyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { PreferencesTab } from "./tabs/PreferencesTab";
import { SubscriptionTab } from "./tabs/SubscriptionTab";
import { IdentificationTab } from "./tabs/IdentificationTab";

const tabs = [
  { id: "profile", label: "Profile", component: ProfileTab },
  { id: "company", label: "Company", component: CompanyTab },
  {
    id: "identification",
    label: "ID Verification",
    component: IdentificationTab,
  },
  { id: "subscription", label: "Subscription", component: SubscriptionTab },
  { id: "preferences", label: "Preferences", component: PreferencesTab },
];

export const AccountTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="client-account__tabs">
      <div className="panel">
        <div className="panel-header">
          <TabList className="settings-tabs">
            {tabs.map((tab) => (
              <li
                key={tab.id}
                className={`settings-tab ${
                  activeTab === tab.id ? "active" : ""
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </li>
            ))}
          </TabList>
        </div>

        <div className="panel-content">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-content ${activeTab === tab.id ? "active" : ""}`}
            >
              <tab.component />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
