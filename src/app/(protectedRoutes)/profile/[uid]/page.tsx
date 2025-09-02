"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@components/FormElements";
import { InsightCardList } from "@components/Cards";
import { PageHeader } from "@components/PageElements";
import { useParams, useRouter } from "next/navigation";
import { TableColumn, Table } from "@components/Table";
import { ListItem } from "@components/ListItem/ListItem";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";

interface ProfileViewPageProps {
  params?: { uid: string };
}

const ProfileViewPage: React.FC<ProfileViewPageProps> = () => {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;

  // TODO: Replace with API call to fetch user profile data
  // const { data: profileData, isLoading, error } = useGetUserProfile(uid);2

  // Placeholder data structure - replace with actual API data
  const profileData = {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
    },
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
      email: "",
    },
    lease: {
      property: "",
      unit: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      securityDeposit: "",
    },
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

  // Data arrays for each section
  const personalInfoItems = [
    {
      icon: "bx-user",
      label: "Full Name",
      value: profileData.personalInfo.fullName,
    },
    {
      icon: "bx-calendar",
      label: "Date of Birth",
      value: profileData.personalInfo.dateOfBirth,
    },
    {
      icon: "bx-male-sign",
      label: "Gender",
      value: profileData.personalInfo.gender,
    },
    {
      icon: "bx-phone",
      label: "Phone Number",
      value: profileData.personalInfo.phone,
    },
    {
      icon: "bx-envelope",
      label: "Email Address",
      value: profileData.personalInfo.email,
    },
  ];

  const addressInfoItems = [
    {
      icon: "bx-home",
      label: "Street Address",
      value: profileData.address.streetAddress,
    },
    { icon: "bx-buildings", label: "City", value: profileData.address.city },
    { icon: "bx-map", label: "State", value: profileData.address.state },
    {
      icon: "bx-map-pin",
      label: "ZIP Code",
      value: profileData.address.zipCode,
    },
    { icon: "bx-globe", label: "Country", value: profileData.address.country },
  ];

  const emergencyContactItems = [
    {
      icon: "bx-user-circle",
      label: "Contact Name",
      value: profileData.emergencyContact.name,
    },
    {
      icon: "bx-heart",
      label: "Relationship",
      value: profileData.emergencyContact.relationship,
    },
    {
      icon: "bx-phone",
      label: "Phone Number",
      value: profileData.emergencyContact.phone,
    },
    {
      icon: "bx-envelope",
      label: "Email Address",
      value: profileData.emergencyContact.email,
    },
  ];

  const leaseInfoItems = [
    {
      icon: "bx-building",
      label: "Property",
      value: profileData.lease.property,
    },
    {
      icon: "bx-door-open",
      label: "Unit Number",
      value: profileData.lease.unit,
    },
    {
      icon: "bx-play-circle",
      label: "Lease Start",
      value: profileData.lease.startDate,
    },
    {
      icon: "bx-stop-circle",
      label: "Lease End",
      value: profileData.lease.endDate,
    },
    {
      icon: "bx-money",
      label: "Monthly Rent",
      value: profileData.lease.monthlyRent,
    },
    {
      icon: "bx-shield",
      label: "Security Deposit",
      value: profileData.lease.securityDeposit,
    },
  ];

  const insightCards = [
    {
      title: "Current Property",
      value: profileData.lease.unit || "N/A",
      icon: <i className="bx bx-home"></i>,
      description: profileData.lease.property || "No property assigned",
    },
    {
      title: "Lease Status",
      value: profileData.lease.endDate ? "Active" : "N/A",
      icon: <i className="bx bx-calendar"></i>,
      description: profileData.lease.endDate
        ? `Expires ${profileData.lease.endDate}`
        : "No lease information",
    },
    {
      title: "Payment Status",
      value: "N/A",
      icon: <i className="bx bx-wallet"></i>,
      description: "No payment data available",
    },
    {
      title: "Open Requests",
      value: "0",
      icon: <i className="bx bx-wrench"></i>,
      description: "No active requests",
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
                    src="/assets/imgs/avatar.png"
                    alt="Profile"
                    width={100}
                    height={100}
                    className="profile-header__avatar-image"
                  />
                </div>
                <div className="profile-header__content">
                  <h2 className="profile-header__name">
                    {profileData.personalInfo.fullName}
                  </h2>
                  <p className="profile-header__email">
                    {profileData.personalInfo.email}
                  </p>
                  <div className="profile-header__badges">
                    <span className="status-badge status-badge-success">
                      Active Tenant
                    </span>
                    <span className="status-badge status-badge-light">
                      Member Since Jan 2025
                    </span>
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
            <PanelHeader header={{ title: "Address Information" }} />
            <PanelContent>
              <div className="info-list">
                {addressInfoItems.map((item, index) => (
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
            <PanelHeader header={{ title: "Emergency Contact" }} />
            <PanelContent>
              <div className="info-list">
                {emergencyContactItems.map((item, index) => (
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
            <PanelHeader header={{ title: "Lease & Property Details" }} />
            <PanelContent>
              <div className="info-list">
                {leaseInfoItems.map((item, index) => (
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
