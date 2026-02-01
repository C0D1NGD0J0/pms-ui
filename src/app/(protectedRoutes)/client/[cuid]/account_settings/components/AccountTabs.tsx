"use client";
import React, { useMemo } from "react";
import { IClient } from "@src/interfaces";
import { Form } from "@components/FormElements";
import { UseFormReturnType } from "@mantine/form";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { TabContainer, TabListItem, TabList } from "@components/Tab/components";
import { UpdateClientDetailsFormData } from "@src/validations/client.validations";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { CompanyTab } from "./tabs/CompanyTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { AdminUsersTab } from "./tabs/AdminUsersTab";
import { PreferencesTab } from "./tabs/PreferencesTab";
import { SubscriptionTab } from "./tabs/SubscriptionTab";
import { IdentificationTab } from "./tabs/IdentificationTab";

interface AccountTabsProps {
  inEditMode: boolean;
  clientInfo: IClient;
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasTabErrors: (tabId: string) => boolean;
  clientForm?: UseFormReturnType<UpdateClientDetailsFormData>;
}

export function AccountTabs({
  inEditMode,
  clientForm,
  clientInfo,
  activeTab,
  onTabChange,
  hasTabErrors,
}: AccountTabsProps) {
  const { isSuperAdmin, isAdmin } = useUnifiedPermissions();

  const tabs = useMemo(
    () => [
      {
        key: "profile",
        tabLabel: "Profile",
        isVisible: true,
      },
      {
        key: "identification",
        tabLabel: "Identification",
        isVisible: true,
      },
      {
        key: "company",
        tabLabel: "Company",
        isVisible: clientInfo.accountType.isEnterpriseAccount,
      },
      {
        key: "preferences",
        tabLabel: "Preferences",
        isVisible: true,
      },
      {
        key: "subscription",
        tabLabel: "Subscription",
        isVisible: isSuperAdmin,
      },
      {
        key: "admin-users",
        tabLabel: "Admin Users",
        isVisible: isAdmin,
      },
    ],
    [clientInfo.accountType.isEnterpriseAccount, isSuperAdmin, isAdmin]
  );

  const handleTabChange = (newTab: string) => {
    onTabChange(newTab);
  };

  const renderActiveTabContent = (tab: string) => {
    const tabProps = {
      inEditMode,
      clientInfo,
      clientForm,
    };

    switch (tab) {
      case "profile":
        return <ProfileTab {...tabProps} />;
      case "company":
        return <CompanyTab {...tabProps} />;
      case "preferences":
        return <PreferencesTab {...tabProps} />;
      case "subscription":
        return (
          <SubscriptionTab
            {...tabProps}
            currentProperties={clientInfo.clientStats.totalProperties}
            currentSeats={clientInfo.clientStats.totalUsers}
          />
        );
      case "identification":
        return <IdentificationTab {...tabProps} />;
      case "admin-users":
        return <AdminUsersTab cuid={clientInfo.cuid} />;
      default:
        return <ProfileTab {...tabProps} />;
    }
  };

  return (
    <div className="client-account__tabs">
      <PanelsWrapper>
        <Panel>
          <PanelHeader
            headerTitleComponent={
              <TabContainer
                onChange={handleTabChange}
                defaultTab={activeTab}
                scrollOnChange={false}
              >
                <TabList>
                  {tabs.map((tab) => {
                    if (!tab.isVisible) return null;
                    return (
                      <TabListItem
                        id={tab.key}
                        key={tab.key}
                        label={tab.tabLabel}
                        hasError={hasTabErrors(tab.key)}
                      />
                    );
                  })}
                </TabList>
              </TabContainer>
            }
          />
          <Form id="client-form" onSubmit={() => ""} disabled={inEditMode}>
            <PanelContent className="tab-content active">
              {renderActiveTabContent(activeTab)}
            </PanelContent>
          </Form>
        </Panel>
      </PanelsWrapper>
    </div>
  );
}
