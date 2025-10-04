"use client";
import React from "react";
import Image from "next/image";
import { useAuth } from "@src/store";
import { useRouter } from "next/navigation";
import { Button } from "@components/FormElements";
import { InsightCardList } from "@components/Cards";
import { Skeleton } from "@src/components/Skeleton";
import { PageHeader } from "@components/PageElements";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@components/ListItem/ListItem";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

import { useGetProfileInfo } from "../hooks";

interface ProfileViewPageProps {
  params: Promise<{ uid: string }>;
}

const ProfileViewPage: React.FC<ProfileViewPageProps> = ({ params }) => {
  const { uid } = React.use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { isLoading, data } = useGetProfileInfo(user?.client.cuid ?? "", "");

  // Use actual API data or fallback to empty values
  const profileData = data || {
    personalInfo: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      location: "",
      isActive: false,
      avatar: { url: "" },
    },
    settings: {
      theme: "light",
      loginType: "password",
      timeZone: "UTC",
      lang: "en",
      notifications: {},
      gdprSettings: {},
    },
    userType: "employee",
    roles: [],
    identification: {},
    recentActivity: [],
  };

  const headerBtn = (
    <Button
      className="btn btn-primary"
      label="Edit Profile"
      icon={<i className="bx bx-edit"></i>}
      onClick={() => router.push(`/profile/${uid}/edit`)}
    />
  );

  const personalInfoItems = [
    {
      icon: "bx-user",
      label: "Display Name",
      value: profileData.personalInfo?.displayName || "N/A",
    },
    {
      icon: "bx-user-detail",
      label: "First Name",
      value: profileData.personalInfo?.firstName || "N/A",
    },
    {
      icon: "bx-user-detail",
      label: "Last Name",
      value: profileData.personalInfo?.lastName || "N/A",
    },
    {
      icon: "bx-phone",
      label: "Phone Number",
      value: profileData.personalInfo?.phoneNumber || "N/A",
    },
    {
      icon: "bx-envelope",
      label: "Email Address",
      value: profileData.personalInfo?.email || "N/A",
    },
    {
      icon: "bx-map",
      label: "Location",
      value: profileData.personalInfo?.location || "N/A",
    },
    {
      icon: "bx-id-card",
      label: "User ID",
      value: profileData.personalInfo?.uid || "N/A",
    },
  ];

  const roleInfoItems = [
    {
      icon: "bx-user-badge",
      label: "User Type",
      value: profileData.userType
        ? profileData.userType.charAt(0).toUpperCase() +
          profileData.userType.slice(1)
        : "N/A",
    },
    {
      icon: "bx-shield-check",
      label: "Roles",
      value:
        profileData.roles && profileData.roles.length > 0
          ? profileData.roles.join(", ")
          : "N/A",
    },
    {
      icon: "bx-check-circle",
      label: "Account Status",
      value: profileData.personalInfo?.isActive ? "Active" : "Inactive",
    },
    {
      icon: "bx-key",
      label: "Login Type",
      value: profileData.settings?.loginType || "N/A",
    },
  ];

  const settingsItems = [
    {
      icon: "bx-palette",
      label: "Theme",
      value: profileData.settings?.theme
        ? profileData.settings.theme.charAt(0).toUpperCase() +
          profileData.settings.theme.slice(1)
        : "N/A",
    },
    {
      icon: "bx-world",
      label: "Language",
      value: profileData.settings?.lang || "N/A",
    },
    {
      icon: "bx-time",
      label: "Time Zone",
      value: profileData.settings?.timeZone || "N/A",
    },
    {
      icon: "bx-shield-alt",
      label: "GDPR Consent",
      value: profileData.settings?.gdprSettings?.dataProcessingConsent
        ? "Granted"
        : "Not Granted",
    },
  ];

  const notificationItems = [
    {
      icon: "bx-bell",
      label: "Email Notifications",
      value: profileData.settings?.notifications?.emailNotifications
        ? "Enabled"
        : "Disabled",
    },
    {
      icon: "bx-mobile",
      label: "In-App Notifications",
      value: profileData.settings?.notifications?.inAppNotifications
        ? "Enabled"
        : "Disabled",
    },
    {
      icon: "bx-wrench",
      label: "Maintenance Alerts",
      value: profileData.settings?.notifications?.maintenance
        ? "Enabled"
        : "Disabled",
    },
    {
      icon: "bx-credit-card",
      label: "Payment Alerts",
      value: profileData.settings?.notifications?.payments
        ? "Enabled"
        : "Disabled",
    },
    {
      icon: "bx-cog",
      label: "System Notifications",
      value: profileData.settings?.notifications?.system
        ? "Enabled"
        : "Disabled",
    },
    {
      icon: "bx-message",
      label: "Announcements",
      value: profileData.settings?.notifications?.announcements
        ? "Enabled"
        : "Disabled",
    },
  ];

  const insightCards = [
    {
      title: "Account Status",
      value: profileData.personalInfo?.isActive ? "Active" : "Inactive",
      icon: <i className="bx bx-user-check"></i>,
      description: profileData.personalInfo?.isActive
        ? "Account is active"
        : "Account is inactive",
    },
    {
      title: "User Type",
      value: profileData.userType
        ? profileData.userType.charAt(0).toUpperCase() +
          profileData.userType.slice(1)
        : "N/A",
      icon: <i className="bx bx-user-badge"></i>,
      description: `User role: ${profileData.userType || "Unknown"}`,
    },
    {
      title: "Theme Preference",
      value: profileData.settings?.theme
        ? profileData.settings.theme.charAt(0).toUpperCase() +
          profileData.settings.theme.slice(1)
        : "N/A",
      icon: <i className="bx bx-palette"></i>,
      description: `Current theme setting`,
    },
    {
      title: "Notifications",
      value: profileData.settings?.notifications?.emailNotifications
        ? "Enabled"
        : "Disabled",
      icon: <i className="bx bx-bell"></i>,
      description: "Email notification status",
    },
  ];

  const activityColumns: TableColumn<any>[] = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Activity",
      dataIndex: "activity",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string, record: any) => (
        <span className={`status-badge status-badge-${status}`}>
          {record.statusText}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <Button
          className="btn-icon"
          label=""
          icon={<i className="bx bx-show"></i>}
          onClick={() => console.log("View activity")}
        />
      ),
    },
  ];

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <div className="page">
      <PageHeader title="My Profile" subtitle="" headerBtn={headerBtn} />

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <PanelContent>
              <div className="profile-header">
                <div className="profile-header__avatar">
                  <Image
                    src={
                      profileData.personalInfo?.avatar?.url ||
                      "/assets/imgs/avatar.png"
                    }
                    alt="Profile"
                    width={100}
                    height={100}
                    className="profile-header__avatar-image"
                  />
                </div>
                <div className="profile-header__content">
                  <h2 className="profile-header__name">
                    {profileData.personalInfo?.displayName || "N/A"}
                  </h2>
                  <p className="profile-header__email">
                    {profileData.personalInfo?.email || "N/A"}
                  </p>
                  <div className="profile-header__badges">
                    <span
                      className={`status-badge ${
                        profileData.personalInfo?.isActive
                          ? "status-badge-success"
                          : "status-badge-danger"
                      }`}
                    >
                      {profileData.personalInfo?.isActive
                        ? "Active"
                        : "Inactive"}{" "}
                      {profileData.userType || "User"}
                    </span>
                    {profileData.roles && profileData.roles.length > 0 && (
                      <span className="status-badge status-badge-light">
                        {profileData.roles.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>

      <InsightCardList insights={insightCards} />

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <PanelHeader header={{ title: "Personal Information" }} />
            <PanelContent>
              <div className="info-list">
                {personalInfoItems.map((item, index) => (
                  <ListItem
                    key={index}
                    variant="info"
                    icon={item.icon}
                    title={item.label}
                    subtitle={item.value}
                  />
                ))}
              </div>
            </PanelContent>
          </Panel>

          <Panel>
            <PanelHeader header={{ title: "Role & Permissions" }} />
            <PanelContent>
              <div className="info-list">
                {roleInfoItems.map((item, index) => (
                  <ListItem
                    key={index}
                    variant="info"
                    icon={item.icon}
                    title={item.label}
                    subtitle={item.value}
                  />
                ))}
              </div>
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <PanelHeader header={{ title: "Account Settings" }} />
            <PanelContent>
              <div className="info-list">
                {settingsItems.map((item, index) => (
                  <ListItem
                    key={index}
                    variant="info"
                    icon={item.icon}
                    title={item.label}
                    subtitle={item.value}
                  />
                ))}
              </div>
            </PanelContent>
          </Panel>

          <Panel>
            <PanelHeader header={{ title: "Notification Preferences" }} />
            <PanelContent>
              <div className="info-list">
                {notificationItems.map((item, index) => (
                  <ListItem
                    key={index}
                    variant="info"
                    icon={item.icon}
                    title={item.label}
                    subtitle={item.value}
                  />
                ))}
              </div>
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>

      <div className="flex-row">
        <PanelsWrapper>
          <Panel>
            <PanelHeader header={{ title: "Recent Activity" }} />
            <PanelContent>
              <Table
                columns={activityColumns}
                dataSource={profileData.recentActivity}
                rowKey="activity"
                pagination={false}
                tableVariant="default"
              />
            </PanelContent>
          </Panel>
        </PanelsWrapper>
      </div>
    </div>
  );
};

export default ProfileViewPage;
