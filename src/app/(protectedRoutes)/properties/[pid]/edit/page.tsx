"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  IPropertyDocument,
  IPropertyModel,
} from "@interfaces/property.interface";
import { PropertyModel } from "@models/property";
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
  PropertyUnitModal,
  PropertyInfoTab,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
  FinancialTab,
} from "@properties/components";

import { usePropertyEditForm } from "./hooks";

export default function EditProperty() {
  const params = useParams();
  const pid = params.pid as string;
  const [openModal, setOpenModal] = useState(false);

  const {
    form,
    activeTab,
    isLoading,
    setActiveTab,
    saveAddress,
    hasTabErrors,
    isSubmitting,
    handleSubmit,
    propertyData,
    handleOnChange,
    propertyTypeOptions,
    propertyStatusOptions,
    documentTypeOptions,
    isTabVisible,
    propertyTypeUtils,
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
  ].filter((tab) => isTabVisible(tab.key));

  if (isLoading) {
    return <Loading size="regular" description="Loading property data..." />;
  }

  if (!propertyData) {
    return <Loading size="regular" description="Property data not found." />;
  }

  const handleOpenUnitModal = () => {
    setOpenModal(true);
  };
  const handleCloseUnitModal = () => {
    setOpenModal(false);
    console.log("close modal", form.validate());
  };

  // Helper function to safely get raw data from PropertyModel or fallback to raw object
  const getPropertyRawData = (
    data: IPropertyModel | IPropertyDocument
  ): IPropertyDocument => {
    if (data instanceof PropertyModel) {
      return data.getRawData();
    }
    return data as IPropertyDocument;
  };

  return (
    <div className="page edit-property">
      <PageHeader
        title="Edit Property"
        headerBtn={
          <div className="flex-row">
            {propertyTypeUtils.supportsMultipleUnits && (
              <Button
                type="button"
                label="Add Units"
                className="btn-outline"
                onClick={handleOpenUnitModal}
                icon={<i className="bx bx-building-house"></i>}
              />
            )}
            <Button
              type="submit"
              form="property-form"
              label="Save Changes"
              onClick={handleSubmit}
              className="btn-primary"
              icon={<i className="bx bx-save"></i>}
              disabled={!form.isValid() || isSubmitting}
            />
          </div>
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
      <PropertyUnitModal
        isOpen={openModal}
        onClose={handleCloseUnitModal}
        property={getPropertyRawData(propertyData)}
      />
    </div>
  );
}
