"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { AccordionContainer } from "@components/Accordion";
import { AccordionItem } from "@components/Accordion/interface";

import { useProfileFormBase } from "../../hooks/useProfileFormBase";
import { useProfileEditForm } from "../../hooks/useProfileEditForm";
import {
  IdentificationTab,
  PersonalInfoTab,
  DocumentsTab,
  SecurityTab,
  SettingsTab,
} from "../components/index";

const ProfileEditPage: React.FC<{ params: Promise<{ uid: string }> }> = ({
  params,
}) => {
  const router = useRouter();
  const { uid } = use(params);

  const {
    activeTab,
    profileForm,
    handleNestedChange,
    handleProfilePhotoChange,
    setActiveTab,
    hasTabErrors,
    idTypeOptions,
  } = useProfileFormBase();

  const { isDataLoading, isSubmitting, handleUpdate } = useProfileEditForm({
    profileForm,
    uid,
  });

  const handleBack = () => {
    router.back();
  };

  const accordionItems: AccordionItem[] = React.useMemo(() => {
    const items = [
      {
        id: "personal",
        label: "Personal Info",
        subtitle: "Update your personal details and profile photo",
        icon: <i className="bx bx-user"></i>,
        hasError: hasTabErrors("personal"),
        content: (
          <PersonalInfoTab
            profileForm={profileForm}
            handleNestedChange={handleNestedChange}
            handleProfilePhotoChange={handleProfilePhotoChange}
          />
        ),
      },
      {
        id: "identification",
        label: "Identification",
        subtitle: "Manage your identification documents",
        icon: <i className="bx bx-id-card"></i>,
        hasError: hasTabErrors("identification"),
        content: (
          <IdentificationTab
            profileForm={profileForm}
            handleNestedChange={handleNestedChange}
            idTypeOptions={idTypeOptions}
          />
        ),
      },
      {
        id: "settings",
        label: "Settings",
        subtitle: "Configure your account preferences",
        icon: <i className="bx bx-cog"></i>,
        hasError: hasTabErrors("settings"),
        content: (
          <SettingsTab
            profileForm={profileForm}
            handleNestedChange={handleNestedChange}
          />
        ),
      },
      {
        id: "documents",
        label: "Documents",
        subtitle: "View and manage your documents",
        icon: <i className="bx bx-file"></i>,
        hasError: hasTabErrors("documents"),
        content: (
          <DocumentsTab
            profileForm={profileForm}
            handleNestedChange={handleNestedChange}
          />
        ),
      },
      {
        id: "security",
        label: "Security",
        subtitle: "Update security settings and password",
        icon: <i className="bx bx-shield"></i>,
        hasError: hasTabErrors("security"),
        content: (
          <SecurityTab
            profileForm={profileForm}
            handleNestedChange={handleNestedChange}
          />
        ),
      },
    ];

    console.log("[ProfileEditPage] Form errors:", profileForm.errors);

    return items;
  }, [profileForm.errors]);

  if (isDataLoading) {
    return <Loading size="regular" description="Loading profile data..." />;
  }

  return (
    <div className="page profile-edit">
      <PageHeader
        title="Edit Profile"
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
              form="profile-form"
              label="Save Changes"
              onClick={handleUpdate}
              className="btn-primary"
              icon={<i className="bx bx-save"></i>}
              disabled={!profileForm.isValid() || isSubmitting}
            />
          </div>
        }
      />

      <div className="resource-form">
        <Form id="profile-form" onSubmit={handleUpdate} disabled={isSubmitting}>
          <AccordionContainer
            items={accordionItems}
            defaultActiveId={activeTab}
            onChange={setActiveTab}
            showSidebar={true}
            ariaLabel="Profile settings"
          />
          <div className="form-actions">
            <Button
              className="btn btn-default btn-grow"
              label="Cancel"
              onClick={handleBack}
            />
            <Button
              type="submit"
              label="Save Profile"
              className="btn btn-primary btn-grow"
              disabled={!profileForm.isValid() || isSubmitting}
            />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
