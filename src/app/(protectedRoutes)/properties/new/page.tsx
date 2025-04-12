"use client";
import React, { useState } from "react";
import { Button } from "@components/FormElements";
import { PageHeader } from "@components/PageElements";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import {
  PropertyInfoTab,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
} from "./tabs/components";

export default function CreateProperty() {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const tabs = [
    {
      key: "basic",
      tabLabel: "Basic information",
      content: <BasicInfoTab />,
    },
    {
      key: "property",
      tabLabel: "Property Details",
      content: <PropertyInfoTab />,
    },
    {
      key: "amenities",
      tabLabel: "Amenities",
      content: <AmenitiesTab />,
    },
    {
      key: "documents",
      tabLabel: "Photos & Documents",
      content: <DocumentsTab />,
    },
  ];

  return (
    <div className="page add-property">
      <PageHeader
        title="Add New Property"
        subtitle="/properties/new"
        headerBtn={
          <Button
            className="btn btn-secondary"
            label="Upload CSV"
            icon={<i className="bx bx-upload ghost"></i>}
          />
        }
      />

      <div className="flex-row resource-form">
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
                        disabled={false}
                        label={tab.tabLabel}
                      />
                    ))}
                  </TabList>
                </TabContainer>
              }
            />

            {tabs.map((tab) => (
              <PanelContent
                key={tab.key}
                className={`tab-content ${
                  activeTab === tab.key ? "active" : ""
                }`}
              >
                {activeTab === tab.key && tab.content}
              </PanelContent>
            ))}
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
