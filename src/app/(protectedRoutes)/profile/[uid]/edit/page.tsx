"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { TabItem } from "@components/Tab/interface";
import { PageHeader } from "@components/PageElements";
import { TabContainer } from "@components/Tab/components";

import {
  IdentificationTab,
  PersonalInfoTab,
  DocumentsTab,
  SecurityTab,
  SettingsTab,
} from "./components/index";

interface ProfileEditPageProps {
  params?: { uid: string };
}

const ProfileEditPage = ({ params }: ProfileEditPageProps) => {
  // const params = useParams(); // TODO: Use this when implementing API calls
  const router = useRouter();
  // const uid = params.uid as string; // TODO: Use this when implementing API calls
  console.log("Editing profile for UID:", params?.uid);
  const [activeTab, setActiveTab] = useState("personal");

  // TODO: Replace with API call to fetch user profile data
  // const { data: profileData, isLoading, error } = useGetUserProfile(uid);

  // TODO: Populate formData with actual API data when available
  // useEffect(() => {
  //   if (profileData) {
  //     setFormData(profileData);
  //   }
  // }, [profileData]);

  const [formData, setFormData] = useState({
    userInfo: {
      email: "",
    },
    personalInfo: {
      firstName: "",
      lastName: "",
      displayName: "",
      location: "",
      dob: null as Date | null,
      avatar: {
        url: "",
        filename: "",
        key: "",
      },
      phoneNumber: "",
      bio: "",
      headline: "",
    },
    settings: {
      theme: "light" as "light" | "dark",
      loginType: "password" as "otp" | "password",
      notifications: {
        messages: false,
        comments: false,
        announcements: false,
      },
      gdprSettings: {
        dataRetentionPolicy: "standard" as "standard" | "extended" | "minimal",
        dataProcessingConsent: false,
      },
    },
    identification: {
      idType: "passport" as
        | "passport"
        | "drivers-license"
        | "national-id"
        | "corporation-license",
      issueDate: null as Date | null,
      expiryDate: null as Date | null,
      idNumber: "",
      authority: "",
      issuingState: "",
    },
    profileMeta: {
      timeZone: "",
      lang: "en",
    },
    employeeInfo: {
      jobTitle: "",
      department: "",
      reportsTo: "",
      employeeId: "",
      startDate: null as Date | null,
      permissions: [] as string[],
    },
    vendorInfo: {
      vendorId: "",
      linkedVendorUid: "",
      isLinkedAccount: false,
    },
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section.includes(".")) {
      // Handle nested objects like 'settings.notifications' or 'personalInfo.avatar'
      const [mainSection, subSection] = section.split(".");
      setFormData((prev) => ({
        ...prev,
        [mainSection]: {
          ...(prev[mainSection as keyof typeof prev] as any),
          [subSection]: {
            ...(prev[mainSection as keyof typeof prev] as any)[subSection],
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof typeof prev] as any),
          [field]: value,
        },
      }));
    }
  };

  const handleProfilePhotoChange = (file: File | null) => {
    console.log("Profile photo selected:", file);

    if (file) {
      // In a real implementation, you would:
      // 1. Upload file to S3/storage service
      // 2. Get back the URL, key, and filename
      // 3. Update the avatar object with the response

      // For now, just update the filename for demonstration
      const updatedAvatar = {
        ...formData.personalInfo.avatar,
        filename: file.name,
        // url and key would be set after successful upload
      };

      handleInputChange("personalInfo", "avatar", updatedAvatar);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

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
          formData={formData}
          handleInputChange={handleInputChange}
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
          formData={formData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <i className="bx bx-cog"></i>,
      content: (
        <SettingsTab
          formData={formData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      id: "documents",
      label: "Documents",
      icon: <i className="bx bx-file"></i>,
      content: (
        <DocumentsTab
          formData={formData}
          handleInputChange={handleInputChange}
        />
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: <i className="bx bx-shield"></i>,
      content: (
        <SecurityTab
          formData={formData}
          handleInputChange={handleInputChange}
        />
      ),
    },
  ];

  return (
    <div className="page profile-edit">
      <PageHeader
        title="Edit Profile"
        withBreadcrumb={true}
        headerBtn={
          <Button
            className="btn btn-default"
            label="Back"
            icon={<i className="bx bx-arrow-back"></i>}
            onClick={handleBack}
          />
        }
      />

      <div className="scroll">
        <TabContainer
          variant="profile"
          tabItems={tabItems}
          defaultTab={activeTab}
          onChange={handleTabChange}
          scrollOnChange={false}
          ariaLabel="Profile settings tabs"
        />
      </div>
    </div>
  );
};

export default ProfileEditPage;
