"use client";
import React from "react";
import { useParams } from "next/navigation";
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
import {
  PropertyInfoTab,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
  FinancialTab,
  UnitsTab,
} from "@properties/components";

import { usePropertyEditForm } from "./hooks";

export default function EditProperty() {
  const params = useParams();
  const pid = params.pid as string;

  const {
    form,
    activeTab,
    isLoading,
    setActiveTab,
    saveAddress,
    hasTabErrors,
    isSubmitting,
    handleSubmit,
    handleOnChange,
    propertyTypeOptions,
    propertyStatusOptions,
    documentTypeOptions,
  } = usePropertyEditForm(pid);

  const tabs = [
    {
      key: "basic",
      tabLabel: "Basic information",
      content: (
        <BasicInfoTab
          form={form}
          saveAddress={saveAddress}
          handleOnChange={handleOnChange}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
        />
      ),
    },
    {
      key: "financial",
      tabLabel: "Financial",
      content: <FinancialTab form={form} handleOnChange={handleOnChange} />,
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
    {
      key: "units",
      tabLabel: "Units",
      content: <UnitsTab form={form} handleOnChange={handleOnChange} />,
    },
  ];

  if (isLoading) {
    return <Loading size="regular" description="Loading property data..." />;
  }
  return (
    <div className="page edit-property">
      <PageHeader
        title="Edit Property"
        headerBtn={
          <Button
            type="submit"
            form="property-form"
            label="Save Changes"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={!form.isValid() || isSubmitting}
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
                        label={tab.tabLabel}
                        hasError={hasTabErrors(tab.key)}
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
                {activeTab === "basic" ? (
                  <Button
                    className="btn btn-default btn-grow"
                    label="Cancel"
                    onClick={() => window.history.back()}
                  />
                ) : (
                  <Button
                    className="btn btn-default btn-grow"
                    label="Back"
                    onClick={() => {
                      const currentIndex = tabs.findIndex(
                        (tab) => tab.key === activeTab
                      );
                      if (currentIndex > 0) {
                        setActiveTab(tabs[currentIndex - 1].key);
                      }
                    }}
                  />
                )}

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
                    label="Update Property"
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
