"use client";
import { Form } from "@components/FormElements";
import React, { useState, useMemo } from "react";
import { IClient } from "@interfaces/client.interface";
import { TabContainer, TabListItem, TabList } from "@components/Tab/components";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { CompanyTab } from "./tabs/CompanyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { PreferencesTab } from "./tabs/PreferencesTab";
import { SubscriptionTab } from "./tabs/SubscriptionTab";
import { IdentificationTab } from "./tabs/IdentificationTab";

export function AccountTabs({ clientInfo }: { clientInfo: IClient }) {
  const [activeTab, setActiveTab] = useState("profile");
  const tabs = useMemo(
    () => [
      {
        key: "profile",
        tabLabel: "Profile",
        isVisi: true,
      },
      {
        key: "company",
        tabLabel: "Company",
        isVisi: true,
      },
      {
        key: "preferences",
        tabLabel: "Preferences",
        isVisi: true,
      },
      {
        key: "subscription",
        tabLabel: "Subscription",
        isVisi: true,
      },
      {
        key: "identification",
        tabLabel: "Identification",
        isVisi: true,
      },
    ],
    []
  );

  const renderActiveTabContent = (tab: string) => {
    switch (tab) {
      case "profile":
        return <ProfileTab clientInfo={clientInfo} />;
      case "company":
        return <CompanyTab clientInfo={clientInfo} />;
      case "preferences":
        return <PreferencesTab clientInfo={clientInfo} />;
      case "subscription":
        return <SubscriptionTab clientInfo={clientInfo} />;
      case "identification":
        return <IdentificationTab clientInfo={clientInfo} />;
      default:
        return <ProfileTab clientInfo={clientInfo} />;
    }
  };

  return (
    <div className="client-account__tabs">
      <PanelsWrapper>
        <Panel>
          <PanelHeader
            headerTitleComponent={
              <TabContainer onChange={setActiveTab} defaultTab={activeTab}>
                <TabList>
                  {tabs.map((tab) => (
                    <TabListItem
                      id={tab.key}
                      key={tab.key}
                      label={tab.tabLabel}
                      hasError={undefined}
                    />
                  ))}
                </TabList>
              </TabContainer>
            }
          />
          <Form id="client-form" onSubmit={() => ""} disabled={true}>
            <PanelContent className="tab-content active">
              {renderActiveTabContent(activeTab)}
            </PanelContent>
          </Form>
        </Panel>
      </PanelsWrapper>
    </div>
  );
}
