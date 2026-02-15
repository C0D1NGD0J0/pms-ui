"use client";
import React, { useState, use } from "react";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { withClientAccess } from "@hooks/permissionHOCs";
import { PropertyChangesModal } from "@components/Property";
import { useSearchParams, useRouter } from "next/navigation";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import { PendingChangesBanner } from "@src/components/PendingChangesBanner";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
import {
  usePropertyEditForm,
  usePropertyFormBase,
  usePropertyData,
} from "@properties/hooks";
import {
  PropertyInfoTab,
  BasicInfoTab,
  AmenitiesTab,
  DocumentsTab,
  FinancialTab,
  UnitsTab,
} from "@properties/components";

interface EditPropertyProps {
  params: Promise<{ cuid: string; pid: string }>;
}

function EditProperty({ params }: EditPropertyProps) {
  const router = useRouter();
  const { pid } = use(params);
  const searchParams = useSearchParams();

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
  const { data, refetch } = usePropertyData(pid);

  React.useEffect(() => {
    const showChanges = searchParams.get("showChanges");
    if (
      showChanges === "true" &&
      data?.property?.pendingChangesPreview &&
      !isChangesModalOpen
    ) {
      setIsChangesModalOpen(true);

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("showChanges");
      router.replace(newUrl.pathname, { scroll: false });
    }
  }, [
    searchParams,
    data?.property?.pendingChangesPreview,
    isChangesModalOpen,
    router,
  ]);

  const handleViewChanges = () => {
    setIsChangesModalOpen(true);
  };

  const closeChangesModal = () => {
    setIsChangesModalOpen(false);
  };

  const handleModalSuccess = () => {
    closeChangesModal();
    router.refresh();
    refetch();
  };

  const canEdit = data?.property
    ? Object.keys(data.property?.pendingChanges || []).length === 0 ||
      permission.isManagerOrAbove
    : true;

  const handleBack = React.useCallback(() => {
    router.back();
  }, [router]);

  const handleHistoryBack = React.useCallback(() => {
    window.history.back();
  }, []);

  const handlePreviousTab = React.useCallback(() => {
    const tabKeys = [
      "basic",
      "financial",
      "property",
      "amenities",
      "documents",
    ];
    if (propertyData?.unitInfo?.canAddUnit) {
      tabKeys.push("units");
    }
    const currentIndex = tabKeys.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabKeys[currentIndex - 1]);
    }
  }, [activeTab, setActiveTab, propertyData?.unitInfo?.canAddUnit]);

  const handleNextTab = React.useCallback(() => {
    const tabKeys = [
      "basic",
      "financial",
      "property",
      "amenities",
      "documents",
    ];
    if (propertyData?.unitInfo?.canAddUnit) {
      tabKeys.push("units");
    }
    const currentIndex = tabKeys.indexOf(activeTab);
    if (currentIndex < tabKeys.length - 1) {
      setActiveTab(tabKeys[currentIndex + 1]);
    }
  }, [activeTab, setActiveTab, propertyData?.unitInfo?.canAddUnit]);

  const tabs = React.useMemo(
    () =>
      [
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
      ].filter((tab) => isTabVisible(tab.key)),
    [
      saveAddress,
      propertyForm,
      handleOnChange,
      propertyManagers,
      propertyTypeOptions,
      propertyStatusOptions,
      formConfig,
      permission,
      documentTypeOptions,
      propertyData?.unitInfo?.canAddUnit,
      isTabVisible,
      canEdit,
      propertyForm.values.propertyType,
      propertyForm.values.maxAllowedUnits,
    ]
  );

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
          entityType="property"
          onViewChanges={handleViewChanges}
          updatedAt={
            data.property?.pendingChanges?.updatedAt || new Date().toISOString()
          }
          pendingChanges={data.property.pendingChangesPreview}
          requesterName={data.property?.pendingChanges?.displayName || ""}
        />
      )}
      <PageHeader
        title={`Edit property ${activeTab === "units" ? "units" : ""}`}
        headerBtn={
          <div className="flex-row">
            <Button
              className="btn btn-default mr-2"
              label="Back"
              onClick={handleBack}
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
                      onClick={handleHistoryBack}
                    />
                  ) : (
                    <Button
                      className="btn btn-default btn-grow"
                      label="Back"
                      onClick={handlePreviousTab}
                    />
                  )}

                  {activeTab !== "documents" ? (
                    <Button
                      className="btn btn-primary btn-grow"
                      label="Next"
                      onClick={handleNextTab}
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
          onSuccess={handleModalSuccess}
          onCancel={closeChangesModal}
        />
      )}
    </div>
  );
}

export default withClientAccess(EditProperty);
