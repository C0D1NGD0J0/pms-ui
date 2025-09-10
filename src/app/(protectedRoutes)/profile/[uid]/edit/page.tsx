"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { TabContainer } from "@components/Tab/components";

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
    idTypeOptions,
  } = useProfileFormBase();

  const { isDataLoading, isSubmitting, handleUpdate } = useProfileEditForm({
    profileForm,
    uid,
  });

  const handleBack = () => {
    router.back();
  };

  const tabItems: TabItem[] = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <i className="bx bx-user"></i>,
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
      icon: <i className="bx bx-id-card"></i>,
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
      icon: <i className="bx bx-cog"></i>,
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
      icon: <i className="bx bx-file"></i>,
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
      icon: <i className="bx bx-shield"></i>,
      content: (
        <SecurityTab
          profileForm={profileForm}
          handleNestedChange={handleNestedChange}
        />
      ),
    },
  ];

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
          <TabContainer
            variant="profile"
            tabItems={tabItems}
            defaultTab={activeTab}
            onChange={setActiveTab}
            scrollOnChange={false}
            ariaLabel="Profile settings tabs"
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
