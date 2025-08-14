"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { usePropertyFormBase } from "@properties/hooks";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import { usePropertyEditForm } from "@properties/hooks/usePropertyEditForm";
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

export default function EditProperty() {
  const params = useParams();
  const pid = params.pid as string;

  const {
    activeTab,
    formConfig,
    saveAddress,
    setActiveTab,
    hasTabErrors,
    isTabVisible,
    propertyForm,
    handleOnChange,
    propertyManagers,
    documentTypeOptions,
    propertyTypeOptions,
    propertyStatusOptions,
  } = usePropertyFormBase();
  const { handleUpdate, propertyData, isDataLoading, isSubmitting } =
    usePropertyEditForm({
      propertyForm,
      pid,
    });

  const tabs = [
    {
      key: "basic",
      isVisible: true,
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
      key: "financial",
      tabLabel: "Financial",
      isVisible: true,
      content: (
        <FinancialTab
          form={propertyForm}
          handleOnChange={handleOnChange}
          currencyOptions={formConfig?.currencies || []}
        />
      ),
    },
    {
      key: "property",
      isVisible: true,
      tabLabel: "Property Details",
      content: (
        <PropertyInfoTab
          formConfig={formConfig}
          propertyForm={propertyForm}
          handleOnChange={handleOnChange}
          propertyTypeOptions={propertyTypeOptions}
          propertyStatusOptions={propertyStatusOptions}
        />
      ),
    },
    {
      key: "amenities",
      isVisible: true,
      tabLabel: "Amenities",
      content: (
        <AmenitiesTab
          propertyForm={propertyForm}
          handleOnChange={handleOnChange}
        />
      ),
    },
    {
      isVisible: true,
      key: "documents",
      tabLabel: "Photos & Documents",
      content: (
        <DocumentsTab
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
    {
      key: "units",
      tabLabel: "Units",
      isVisible: propertyData?.unitInfo?.canAddUnit,
      content: <UnitsTab property={propertyForm.values} />,
    },
  ].filter((tab) => isTabVisible(tab.key));

  if (isDataLoading) {
    return <Loading size="regular" description="Loading property data..." />;
  }

  if (!propertyData) {
    return <Loading size="regular" description="Property data not found." />;
  }
  return (
    <div className="page edit-property">
      <PageHeader
        title={`Edit property ${activeTab === "units" ? "units" : ""}`}
        headerBtn={
          <div className="flex-row">
            {activeTab !== "units" && (
              <Button
                type="submit"
                form="property-form"
                label="Save Changes"
                onClick={handleUpdate}
                className="btn-primary"
                icon={<i className="bx bx-save"></i>}
                disabled={!propertyForm.isValid() || false}
              />
            )}
          </div>
        }
      />

      <div className="flex-row resource-form">
        <PanelsWrapper>
          <Panel>
            <PanelHeader
              headerTitleComponent={
                <TabContainer
                  mode="edit"
                  onChange={setActiveTab}
                  defaultTab={activeTab}
                >
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
              id="property-form"
              onSubmit={handleUpdate}
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

              {activeTab !== "units" ? (
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
                      disabled={!propertyForm.isValid() || isSubmitting}
                    />
                  )}
                </div>
              ) : null}
            </Form>
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
}
