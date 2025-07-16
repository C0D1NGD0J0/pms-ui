"use client";
import React, { useState } from "react";
import { PageHeader } from "@components/PageElements";
import { TableColumn, Table } from "@components/Table";
import { Button, Form } from "@components/FormElements";
import { TabContainer, TabListItem, TabList } from "@components/Tab";
import {
  PanelsWrapper,
  PanelContent,
  PanelHeader,
  Panel,
} from "@components/Panel";
import {
  IInvitationTableData,
  IInvitationFormData,
  IUserRole,
} from "@interfaces/invitation.interface";

import {
  EmployeeDetailsTab,
  RoleSelectionTab,
  VendorDetailsTab,
  ReviewTab,
} from "../../components";

const InvitePage: React.FC = () => {
  const [formData, setFormData] = useState<IInvitationFormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    inviteeEmail: "",
    role: "EMPLOYEE",
    metadata: {
      inviteMessage: "",
      expectedStartDate: undefined,
    },
  });

  const [selectedRole, setSelectedRole] = useState<IUserRole | null>(null);
  const [activeTab, setActiveTab] = useState("role");
  const [invitations] = useState<IInvitationTableData[]>([]);
  const [messageCount, setMessageCount] = useState(0);

  // Handle form field changes
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const result = { ...prev };
      let current: any = result;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return result;
    });
  };

  // Handle role selection
  const handleRoleSelect = (role: IUserRole) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Tab configuration
  const tabs = [
    {
      key: "role",
      tabLabel: "Role Selection",
      isVisible: true,
      content: (
        <RoleSelectionTab
          formData={formData}
          selectedRole={selectedRole}
          messageCount={messageCount}
          onRoleSelect={handleRoleSelect}
          onFieldChange={handleFieldChange}
          onMessageCountChange={setMessageCount}
        />
      ),
    },
    {
      key: "details",
      tabLabel:
        selectedRole === "EMPLOYEE"
          ? "Employee Details"
          : selectedRole === "VENDOR"
          ? "Vendor Details"
          : "Details",
      isVisible: !!selectedRole,
      content: (
        <>
          {selectedRole === "EMPLOYEE" && (
            <EmployeeDetailsTab
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          )}
          {selectedRole === "VENDOR" && (
            <VendorDetailsTab
              formData={formData}
              messageCount={messageCount}
              onFieldChange={handleFieldChange}
              onMessageCountChange={setMessageCount}
            />
          )}
        </>
      ),
    },
    {
      key: "review",
      tabLabel: "Review & Send",
      isVisible: true,
      content: <ReviewTab formData={formData} selectedRole={selectedRole} />,
    },
  ];

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add invitation logic here
  };

  // Handle save draft
  const handleSaveDraft = () => {
    console.log("Draft saved:", formData);
  };

  // Handle cancel
  const handleCancel = () => {
    if (
      confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      // Reset form or navigate away
      setFormData({
        personalInfo: {
          firstName: "",
          lastName: "",
          phoneNumber: "",
        },
        inviteeEmail: "",
        role: "EMPLOYEE",
        metadata: {
          inviteMessage: "",
          expectedStartDate: undefined,
        },
      });
      setSelectedRole(null);
      setActiveTab("basic");
    }
  };

  // Table columns for invitations
  const invitationColumns: TableColumn<IInvitationTableData>[] = [
    {
      title: "Recipient",
      dataIndex: "inviteeFullName",
      render: (_, record) => (
        <div>
          <div className="table-primary-text">{record.inviteeFullName}</div>
          <div className="table-secondary-text">{record.inviteeEmail}</div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => (
        <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      isStatus: true,
    },
    {
      title: "Date Sent",
      dataIndex: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expires",
      dataIndex: "expiresAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="table-actions">
          <Button
            label="Resend"
            className="btn-sm btn-outline"
            onClick={() => console.log("Resend:", record.iuid)}
          />
          <Button
            label="Revoke"
            className="btn-sm btn-danger"
            onClick={() => console.log("Revoke:", record.iuid)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="page add-users-page">
      <PageHeader
        title="Send Invitation"
        subtitle="users / invite"
        headerBtn={
          <div className="flex-row">
            <Button
              label="Save Draft"
              className="btn-outline"
              icon={<i className="bx bx-save"></i>}
              onClick={handleSaveDraft}
            />
            <Button
              label="Send Invitation"
              className="btn-primary"
              icon={<i className="bx bx-send"></i>}
              onClick={handleSubmit}
            />
          </div>
        }
      />

      {/* Form Section */}
      <div className="flex-row resource-form">
        <PanelsWrapper>
          <Panel>
            <PanelHeader
              headerTitleComponent={
                <TabContainer
                  defaultTab="role"
                  onChange={handleTabChange}
                  mode="new"
                >
                  <TabList>
                    {tabs
                      .filter((tab) => tab.isVisible)
                      .map((tab) => (
                        <TabListItem
                          key={tab.key}
                          id={tab.key}
                          label={tab.tabLabel}
                        />
                      ))}
                  </TabList>
                </TabContainer>
              }
            />

            <Form className="resource-form">
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
            </Form>

            {/* Form Actions */}
            <div className="form-actions">
              <Button
                label="Cancel"
                className="btn-outline-ghost"
                onClick={handleCancel}
              />
              <Button
                label="Save as Draft"
                className="btn-outline"
                onClick={handleSaveDraft}
              />
              <Button
                label="Send Invitation"
                className="btn-primary"
                onClick={handleSubmit}
              />
            </div>
          </Panel>
        </PanelsWrapper>
      </div>

      {/* Invitations Table */}
      <div className="flex-row">
        <div className="panels">
          <Panel variant="alt-2">
            <Table
              columns={invitationColumns}
              dataSource={invitations}
              withHeader={true}
              headerTitle="Recent Invitations"
              searchOpts={{
                value: "",
                placeholder: "Search by name or email...",
                onChange: () => {},
              }}
              filterOpts={{
                value: "all",
                options: [
                  { label: "All", value: "all" },
                  { label: "Pending", value: "pending" },
                  { label: "Accepted", value: "accepted" },
                  { label: "Expired", value: "expired" },
                  { label: "Revoked", value: "revoked" },
                ],
                onFilterChange: () => {},
              }}
              tableVariant="alt-2"
            />
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
