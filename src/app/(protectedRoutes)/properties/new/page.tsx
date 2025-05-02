"use client";
import React, { useState } from "react";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { usePropertyForm } from "./hooks";
import { CsvUploadModal } from "./components";
import {
  PropertyInfoTab,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
} from "./tabs/components";

export default function CreateProperty() {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

  const {
    form,
    activeTab,
    setActiveTab,
    isConfigLoading,
    isSubmitting,
    handleSubmit,
    handleOnChange,
    propertyTypeOptions,
    propertyStatusOptions,
    documentTypeOptions,
  } = usePropertyForm();

  const handleOpenCSVModal = () => {
    setIsCSVModalOpen(true);
  };

  const handleCloseCSVModal = () => {
    setIsCSVModalOpen(false);
  };

  const tabs = [
    {
      key: "basic",
      tabLabel: "Basic information",
      content: (
        <BasicInfoTab
          form={form}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      key: "property",
      tabLabel: "Property Details",
      content: (
        <PropertyInfoTab
          form={form}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      key: "amenities",
      tabLabel: "Amenities",
      content: <AmenitiesTab form={form} handleOnChange={handleOnChange} />,
    },
    {
      key: "documents",
      tabLabel: "Photos & Documents",
      content: (
        <DocumentsTab
          form={form}
          documentTypeOptions={
            documentTypeOptions as {
              value:
                | "deed"
                | "tax"
                | "insurance"
                | "inspection"
                | "other"
                | "lease";
              label: string;
            }[]
          }
        />
      ),
    },
  ];

  if (isConfigLoading) {
    return <Loading size="regular" description="Setting up form..." />;
  }

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
            onClick={handleOpenCSVModal}
          />
        }
      />

      <CsvUploadModal isOpen={isCSVModalOpen} onClose={handleCloseCSVModal} />

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
            <Form
              onSubmit={handleSubmit}
              id="property-form"
              disabled={isSubmitting}
            >
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

              <div className="form-actions">
                <Button
                  className="btn btn-default btn-grow"
                  label="Cancel"
                  onClick={() => form.reset()}
                />

                {activeTab !== "documents" ? (
                  <Button
                    className="btn btn-primary btn-grow"
                    label="Next"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(
                        (tab) => tab.key === activeTab
                      );
                      if (currentIndex < tabs.length - 1) {
                        setActiveTab(tabs[currentIndex + 1].key);
                      }
                    }}
                  />
                ) : (
                  <Button
                    type="submit"
                    label="Create Property"
                    className="btn btn-primary btn-grow"
                    disabled={!form.isValid() || isSubmitting}
                  />
                )}
              </div>
            </Form>
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
