"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { TabContainer } from "@components/Tab/components";
import { useUnifiedPermissions } from "@hooks/useUnifiedPermissions";

import { useTenantFormBase, useTenantEditForm } from "../../hooks";
import {
  RentalReferencesTab,
  EmergencyContactTab,
  PersonalInfoTab,
  EmploymentTab,
  PetsTab,
} from "./tabs";

interface TenantEditPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

export default function TenantEditPage({ params }: TenantEditPageProps) {
  const { cuid, uid } = use(params);
  const router = useRouter();
  const { can } = useUnifiedPermissions();

  const {
    tenantForm,
    activeTab,
    setActiveTab,
    addEmployerInfo,
    removeEmployerInfo,
    addRentalReference,
    removeRentalReference,
    addPet,
    removePet,
  } = useTenantFormBase();

  const { isDataLoading, isSubmitting, handleUpdate } = useTenantEditForm({
    tenantForm,
    cuid,
    uid,
  });

  const canUpdateUser = can("user:update");

  React.useEffect(() => {
    if (!canUpdateUser && !isDataLoading) {
      router.back();
    }
  }, [canUpdateUser, isDataLoading, router]);

  const handleBack = () => {
    router.back();
  };

  if (isDataLoading) {
    return <Loading description="Loading tenant data..." />;
  }

  if (!canUpdateUser) {
    return null;
  }

  const tabItems: TabItem[] = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <i className="bx bx-user"></i>,
      content: <PersonalInfoTab tenantForm={tenantForm} />,
    },
    {
      id: "employment",
      label: "Employment",
      icon: <i className="bx bx-briefcase"></i>,
      content: (
        <EmploymentTab
          tenantForm={tenantForm}
          addEmployerInfo={addEmployerInfo}
          removeEmployerInfo={removeEmployerInfo}
        />
      ),
    },
    {
      id: "references",
      label: "References",
      icon: <i className="bx bx-home"></i>,
      content: (
        <RentalReferencesTab
          tenantForm={tenantForm}
          addRentalReference={addRentalReference}
          removeRentalReference={removeRentalReference}
        />
      ),
    },
    {
      id: "pets",
      label: "Pets",
      icon: <i className="bx bx-bone"></i>,
      content: (
        <PetsTab
          tenantForm={tenantForm}
          addPet={addPet}
          removePet={removePet}
        />
      ),
    },
    {
      id: "emergency",
      label: "Emergency Contact",
      icon: <i className="bx bx-phone"></i>,
      content: <EmergencyContactTab tenantForm={tenantForm} />,
    },
  ];

  return (
    <div className="page tenant-edit">
      <PageHeader
        title="Edit Tenant"
        withBreadcrumb={true}
        headerBtn={
          <div className="flex-row">
            <Button
              className="btn btn-default"
              label="Back"
              icon={<i className="bx bx-arrow-back"></i>}
              onClick={handleBack}
            />
            <Button
              type="submit"
              form="tenant-form"
              label="Save Changes"
              onClick={handleUpdate}
              className="btn-primary"
              icon={<i className="bx bx-save"></i>}
              disabled={!tenantForm.isValid() || isSubmitting}
            />
          </div>
        }
      />

      <div className="resource-form">
        <Form id="tenant-form" onSubmit={handleUpdate} disabled={isSubmitting}>
          <TabContainer
            variant="profile"
            tabItems={tabItems}
            defaultTab={activeTab}
            onChange={setActiveTab}
            scrollOnChange={false}
            ariaLabel="Tenant information tabs"
          />
          <div className="form-actions">
            <Button
              className="btn btn-default btn-grow"
              label="Cancel"
              onClick={handleBack}
            />
            <Button
              type="submit"
              className="btn btn-primary btn-grow"
              label={isSubmitting ? "Saving..." : "Save Changes"}
              disabled={!tenantForm.isValid() || isSubmitting}
              icon={<i className="bx bx-save"></i>}
            />
          </div>
        </Form>
      </div>
    </div>
  );
}
