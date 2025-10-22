"use client";

import React, { useState } from "react";
import { Loading } from "@components/Loading";
import { FormSection } from "@components/FormLayout";
import { Button, Form } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@components/PageElements/Header";
import { useGetVendor } from "@users/vendors/hooks/vendorHooks";
import { useGetEmployeeInfo } from "@users/staff/hooks/employeeHooks";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import { useUserProfileEditForm } from "@app/(protectedRoutes)/users/shared-hooks";
import {
  VendorInvitationTab,
  EmployeeDetailsTab,
} from "@users/add-users/components/tabs";

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

  const userData = userType === "employee" ? employee : vendor;

  const { form, isSubmitting, handleSubmit } = useUserProfileEditForm({
    cuid,
    uid,
    userType: userType || "employee",
    userData,
  });

  const handleCancel = () => {
    router.back();
  };

  const isLoading =
    userType === "employee" ? isLoadingEmployee : isLoadingVendor;
  const isError = userType === "employee" ? isErrorEmployee : isErrorVendor;

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
                    <FormField
                      error={{
                        msg:
                          (form.errors["personalInfo.firstName"] as string) ||
                          "",
                        touched: form.isTouched("personalInfo.firstName"),
                      }}
                    >
                      <FormLabel htmlFor="firstName" label="First Name *" />
                      <FormInput
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={form.values.personalInfo.firstName}
                        onChange={(e) =>
                          form.setFieldValue(
                            "personalInfo.firstName",
                            e.target.value
                          )
                        }
                        hasError={!!form.errors["personalInfo.firstName"]}
                        required
                      />
                    </FormField>
                    <FormField
                      error={{
                        msg:
                          (form.errors["personalInfo.lastName"] as string) ||
                          "",
                        touched: form.isTouched("personalInfo.lastName"),
                      }}
                    >
                      <FormLabel htmlFor="lastName" label="Last Name *" />
                      <FormInput
                        id="lastName"
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        value={form.values.personalInfo.lastName}
                        onChange={(e) =>
                          form.setFieldValue(
                            "personalInfo.lastName",
                            e.target.value
                          )
                        }
                        hasError={!!form.errors["personalInfo.lastName"]}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="form-fields">
                    <FormField
                      error={{
                        msg:
                          (form.errors["personalInfo.email"] as string) || "",
                        touched: form.isTouched("personalInfo.email"),
                      }}
                    >
                      <FormLabel htmlFor="email" label="Email Address *" />
                      <FormInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter email address"
                        value={form.values.personalInfo.email}
                        onChange={(e) =>
                          form.setFieldValue(
                            "personalInfo.email",
                            e.target.value
                          )
                        }
                        hasError={!!form.errors["personalInfo.email"]}
                        required
                      />
                    </FormField>
                    <FormField
                      error={{
                        msg:
                          (form.errors["personalInfo.phoneNumber"] as string) ||
                          "",
                        touched: form.isTouched("personalInfo.phoneNumber"),
                      }}
                    >
                      <FormLabel htmlFor="phoneNumber" label="Phone Number" />
                      <FormInput
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        placeholder="Enter phone number"
                        value={form.values.personalInfo.phoneNumber || ""}
                        onChange={(e) =>
                          form.setFieldValue(
                            "personalInfo.phoneNumber",
                            e.target.value
                          )
                        }
                        hasError={!!form.errors["personalInfo.phoneNumber"]}
                      />
                    </FormField>
                  </div>
                </FormSection>

                {userType === "employee" ? (
                  <EmployeeDetailsTab form={form} collapsableSections={false} />
                ) : (
                  <VendorInvitationTab
                    form={form}
                    messageCount={messageCount}
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
