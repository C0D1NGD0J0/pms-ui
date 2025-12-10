"use client";
import React, { useState } from "react";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import { useUnifiedPermissions } from "@src/hooks/useUnifiedPermissions";
import { usePropertyFormBase } from "@app/(protectedRoutes)/properties/[cuid]/hooks";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
import {
  PropertyInfoTab,
  CsvUploadModal,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
} from "@app/(protectedRoutes)/properties/[cuid]/components";

import { usePropertyForm } from "./hook";

export default function CreateProperty() {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const {
    activeTab,
    formConfig,
    saveAddress,
    setActiveTab,
    hasTabErrors,
    propertyForm,
    handleOnChange,
    propertyManagers,
    formConfigLoading,
    documentTypeOptions,
    propertyTypeOptions,
    propertyStatusOptions,
  } = usePropertyFormBase();
  const permission = useUnifiedPermissions();
  const { isSubmitting, handleSubmit } = usePropertyForm();

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
          saveAddress={saveAddress}
          propertyForm={propertyForm}
          handleOnChange={handleOnChange}
          propertyManagers={propertyManagers}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
        />
      ),
    },
    {
      key: "property",
      tabLabel: "Property Details",
      content: (
        <PropertyInfoTab
          permission={permission}
          propertyForm={propertyForm}
          formConfig={formConfig}
          handleOnChange={handleOnChange}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
        />
      ),
    },
    {
      key: "amenities",
      tabLabel: "Amenities",
      content: (
        <AmenitiesTab
          propertyForm={propertyForm}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      key: "documents",
      tabLabel: "Photos & Documents",
      content: (
        <DocumentsTab
          permission={permission}
          propertyForm={propertyForm}
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

  if (formConfigLoading) {
    return <Loading size="regular" description="Setting up propertyForm..." />;
  }

  return (
    <div className="page add-property">
      <PageHeader
        title="Add New Property"
        subtitle="/properties/new"
        headerBtn={
          <>
            {permission.isManagerOrAbove && (
              <Button
                className="btn btn-secondary"
                label="Upload CSV"
                icon={<i className="bx bx-upload ghost"></i>}
                onClick={handleOpenCSVModal}
              />
            )}
          </>
        }
      />

      <CsvUploadModal isOpen={isCSVModalOpen} onClose={handleCloseCSVModal} />

      <div className="flex-row resource-form">
        <PanelsWrapper>
          <Panel>
            <PanelHeader
              headerTitleComponent={
                <TabContainer
                  mode="new"
                  onChange={setActiveTab}
                  defaultTab={activeTab}
                >
                  <TabList>
                    {tabs.map((tab) => (
                      <TabListItem
                        id={tab.key}
                        key={tab.key}
                        disabled={false}
                        label={tab.tabLabel}
                        hasError={hasTabErrors(tab.key)}
                      />
                    ))}
                  </TabList>
                </TabContainer>
              }
            />
            <Form
              id="propertyForm"
              disabled={isSubmitting}
              onSubmit={propertyForm.onSubmit(handleSubmit)}
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
                  onClick={() => propertyForm.reset()}
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
                    disabled={!propertyForm.isValid() || isSubmitting}
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
