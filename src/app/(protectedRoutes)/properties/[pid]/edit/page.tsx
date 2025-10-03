"use client";
import React, { useState } from "react";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { useParams, useRouter } from "next/navigation";
import { Button, Form } from "@components/FormElements";
import { usePropertyFormBase } from "@properties/hooks";
import { usePropertyData } from "@properties/hooks/usePropertyData";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { useApproveProperty, useRejectProperty } from "@properties/hooks";
import { usePropertyEditForm } from "@properties/hooks/usePropertyEditForm";
import {
  PendingChangesBanner,
  PropertyChangesModal,
} from "@components/Property";
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
  const router = useRouter();

  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);

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
  const permission = useUnifiedPermissions();
  const { data } = usePropertyData(pid);
  const approvePropertyMutation = useApproveProperty(
    data?.property?.cuid || ""
  );
  const rejectPropertyMutation = useRejectProperty(data?.property?.cuid || "");

  const handleViewChanges = () => {
    setIsChangesModalOpen(true);
  };

  const handleApprove = (notes?: string) => {
    if (!data?.property?.pid) return;
    approvePropertyMutation.mutate(
      { pid: data.property.pid, notes },
      {
        onSuccess: () => {
          setIsChangesModalOpen(false);
          router.refresh();
        },
      }
    );
  };

  const handleReject = (reason: string) => {
    if (!data?.property?.pid) return;
    rejectPropertyMutation.mutate(
      { pid: data.property.pid, reason },
      {
        onSuccess: () => {
          setIsChangesModalOpen(false);
          router.refresh();
        },
      }
    );
  };

  const closeChangesModal = () => {
    setIsChangesModalOpen(false);
  };

  const canEdit = data?.property
    ? Object.keys(data.property?.pendingChanges || []).length === 0 ||
      permission.isManagerOrAbove
    : true;

  const tabs = [
    {
      key: "basic",
      isVisible: true,
      tabLabel: "Basic information",
      content: (
        <BasicInfoTab
          permission={permission}
          canEditProperty={canEdit}
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
          permission={permission}
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
          permission={permission}
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
      {data?.property?.pendingChangesPreview && (
        <PendingChangesBanner
          property={data.property}
          pendingChanges={data.property.pendingChangesPreview}
          requesterName={
            data.property?.pendingChanges?.displayName || "Unknown User"
          }
          onViewChanges={handleViewChanges}
        />
      )}
      <PageHeader
        title={`Edit property ${activeTab === "units" ? "units" : ""}`}
        headerBtn={
          <div className="flex-row">
            <Button
              className="btn btn-default mr-2"
              label="Back"
              onClick={() => router.back()}
              icon={<i className="bx bx-arrow-back"></i>}
            />
            {activeTab !== "units" && (
              <Button
                type="submit"
                form="property-form"
                label="Save Changes"
                onClick={handleUpdate}
                className="btn-primary"
                icon={<i className="bx bx-save"></i>}
                disabled={!propertyForm.isValid() || !canEdit || isSubmitting}
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
                      disabled={
                        !propertyForm.isValid() || !canEdit || isSubmitting
                      }
                    />
                  )}
                </div>
              ) : null}
            </Form>
          </Panel>
        </PanelsWrapper>
      </div>

      {data?.property?.pendingChangesPreview && (
        <PropertyChangesModal
          property={data.property}
          permission={permission}
          visible={isChangesModalOpen}
          pendingChanges={data.property.pendingChangesPreview}
          requesterName={
            (data.property as any).approvalDetails?.requestedBy?.name ||
            data.property?.pendingChanges?.displayName ||
            "Unknown User"
          }
          onApprove={handleApprove}
          onReject={handleReject}
          onCancel={closeChangesModal}
          isLoading={
            approvePropertyMutation.isPending ||
            rejectPropertyMutation.isPending
          }
        />
      )}
    </div>
  );
}
