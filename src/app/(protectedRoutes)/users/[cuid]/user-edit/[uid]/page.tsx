"use client";

import { Loading } from "@components/Loading";
import React, { useEffect, useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Button, Form } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@components/PageElements/Header";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import {
  useUpdateVendor,
  useGetVendor,
} from "@app/(protectedRoutes)/users/[cuid]/vendors/hooks/vendorHooks";
import { EmployeeDetailsTab } from "@app/(protectedRoutes)/users/[cuid]/add-users/components/tabs/EmployeeDetailsTab";
import { VendorInvitationTab } from "@app/(protectedRoutes)/users/[cuid]/add-users/components/tabs/VendorInvitationTab";
import {
  useGetEmployeeInfo,
  useUpdateEmployee,
} from "@app/(protectedRoutes)/users/[cuid]/staff/hooks/employeeHooks";

interface UserEditPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const { cuid, uid } = React.use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("type") as "employee" | "vendor" | null;

  const [messageCount, setMessageCount] = useState(0);
  const [formData, setFormData] = useState<IInvitationFormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
    inviteeEmail: "",
    role: userType === "employee" ? "staff" : "vendor",
    status: "pending",
  });

  // Fetch employee or vendor data
  const {
    employee,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
  } = useGetEmployeeInfo(cuid, uid, userType === "employee");

  const {
    vendor,
    isLoading: isLoadingVendor,
    isError: isErrorVendor,
  } = useGetVendor(cuid, uid, userType === "vendor");

  // Update mutations
  const updateEmployeeMutation = useUpdateEmployee(cuid, uid);
  const updateVendorMutation = useUpdateVendor(cuid, uid);

  // Populate form data when data is loaded
  useEffect(() => {
    if (userType === "employee" && employee?.profile) {
      setFormData({
        personalInfo: {
          firstName: employee.profile.firstName || "",
          lastName: employee.profile.lastName || "",
          phoneNumber: employee.profile.phoneNumber || "",
        },
        inviteeEmail: employee.profile.email || "",
        role: "staff",
        status: "pending",
        employeeInfo: {
          jobTitle: employee.employeeInfo?.position || "",
          department: employee.employeeInfo?.department || "",
          employeeId: employee.employeeInfo?.employeeId || "",
          reportsTo: employee.employeeInfo?.directManager || "",
          startDate: employee.employeeInfo?.hireDate
            ? new Date(employee.employeeInfo.hireDate)
            : undefined,
          permissions: [],
        },
      });
    } else if (userType === "vendor" && vendor?.profile) {
      setFormData({
        personalInfo: {
          firstName: vendor.profile.firstName || "",
          lastName: vendor.profile.lastName || "",
          phoneNumber: vendor.profile.phoneNumber || "",
        },
        inviteeEmail: vendor.profile.email || "",
        role: "vendor",
        status: "pending",
        vendorInfo: {
          companyName: vendor.vendorInfo?.companyName || "",
          businessType: vendor.vendorInfo?.businessType || "",
          primaryService: "",
          servicesOffered: vendor.vendorInfo?.servicesOffered || {},
          contactPerson: {
            name: vendor.vendorInfo?.contactPerson?.name || "",
            jobTitle: vendor.vendorInfo?.contactPerson?.jobTitle || "",
            email: vendor.vendorInfo?.contactPerson?.email || "",
            phone: vendor.vendorInfo?.contactPerson?.phone || "",
          },
        },
      });
    }
  }, [employee, vendor, userType]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const newData = { ...prev };

      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userType === "employee") {
        await updateEmployeeMutation.mutateAsync(formData);
      } else if (userType === "vendor") {
        await updateVendorMutation.mutateAsync(formData);
      }
      router.back();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const isLoading =
    userType === "employee" ? isLoadingEmployee : isLoadingVendor;
  const isError = userType === "employee" ? isErrorEmployee : isErrorVendor;
  const isSubmitting =
    updateEmployeeMutation.isPending || updateVendorMutation.isPending;

  if (!userType) {
    return (
      <div className="page-container">
        <div className="page">
          <p>
            Invalid user type. Please specify ?type=employee or ?type=vendor
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading description="Loading user data..." />;
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="page">
          <p>Error loading user data. Please try again.</p>
          <Button
            label="Go Back"
            onClick={handleCancel}
            className="btn btn-outline"
          />
        </div>
      </div>
    );
  }

  const pageTitle = userType === "employee" ? "Edit Employee" : "Edit Vendor";

  const headerButtons = (
    <div className="flex-row">
      <Button
        label="Back"
        className="btn btn-outline"
        onClick={handleCancel}
        icon={<i className="bx bx-arrow-back"></i>}
      />
    </div>
  );

  return (
    <div className="page-container">
      <div className="page">
        <PageHeader title={pageTitle} headerBtn={headerButtons} />

        <Form onSubmit={handleSubmit} className="resource-form">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <div className="panel-content">
                <FormSection
                  title={
                    userType === "employee"
                      ? "Personal Information"
                      : "Primary Contact Information"
                  }
                  description={
                    userType === "employee"
                      ? "Edit basic personal details"
                      : "Edit primary contact person details"
                  }
                >
                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="firstName" label="First Name *" />
                      <FormInput
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.personalInfo?.firstName || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.firstName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="lastName" label="Last Name *" />
                      <FormInput
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={formData.personalInfo?.lastName || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.lastName",
                            e.target.value
                          )
                        }
                        required
                      />
                    </FormField>
                  </div>

                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="email" label="Email Address *" />
                      <FormInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={formData.inviteeEmail || ""}
                        onChange={(e) =>
                          handleFieldChange("inviteeEmail", e.target.value)
                        }
                        required
                      />
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="phoneNumber" label="Phone Number" />
                      <FormInput
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={formData.personalInfo?.phoneNumber || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.phoneNumber",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

                {userType === "employee" ? (
                  <EmployeeDetailsTab
                    formData={formData}
                    collapsableSections={false}
                    onFieldChange={handleFieldChange}
                  />
                ) : (
                  <VendorInvitationTab
                    formData={formData}
                    messageCount={messageCount}
                    onFieldChange={handleFieldChange}
                    onMessageCountChange={setMessageCount}
                  />
                )}

                <div
                  className="form-actions"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "flex-end",
                    marginTop: "2rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <Button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    label="Cancel"
                  />
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    loading={isSubmitting}
                    loadingText="Updating..."
                    label="Save Changes"
                  />
                </div>
              </div>
            </Panel>
          </PanelsWrapper>
        </Form>
      </div>
    </div>
  );
}
