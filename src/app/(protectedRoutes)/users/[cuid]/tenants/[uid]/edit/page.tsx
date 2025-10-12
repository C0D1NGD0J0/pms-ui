"use client";

import { useRouter } from "next/navigation";
import { Loading } from "@components/Loading";
import React, { useEffect, useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Button, Form } from "@components/FormElements";
import { PanelsWrapper, Panel } from "@components/Panel";
import { PageHeader } from "@components/PageElements/Header";
import { FormField, FormInput, FormLabel } from "@components/FormElements";
import {
  useUpdateTenant,
  useGetTenant,
} from "@app/(protectedRoutes)/users/[cuid]/tenants/hooks/tenantHooks";

interface TenantEditPageProps {
  params: Promise<{
    cuid: string;
    uid: string;
  }>;
}

interface TenantFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  employerInfo?: {
    companyName?: string;
    position?: string;
    monthlyIncome?: number;
  };
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
    email?: string;
  };
}

export default function TenantEditPage({ params }: TenantEditPageProps) {
  const { cuid, uid } = React.use(params);
  const router = useRouter();

  const [formData, setFormData] = useState<TenantFormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  // Fetch tenant data
  const { tenant, isLoading, isError } = useGetTenant(cuid, uid);

  // Update mutation
  const updateTenantMutation = useUpdateTenant(cuid, uid);

  // Populate form data when tenant data is loaded
  useEffect(() => {
    if (tenant?.profile) {
      setFormData({
        personalInfo: {
          firstName: tenant.profile.firstName || "",
          lastName: tenant.profile.lastName || "",
          email: tenant.profile.email || "",
          phoneNumber: tenant.profile.phoneNumber || "",
        },
        employerInfo: {
          companyName: "",
          position: "",
          monthlyIncome: 0,
        },
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
          email: "",
        },
      });
    }
  }, [tenant]);

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
      await updateTenantMutation.mutateAsync(formData);
      router.back();
    } catch (error) {
      console.error("Failed to update tenant:", error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading description="Loading tenant data..." />;
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="page">
          <p>Error loading tenant data. Please try again.</p>
          <Button
            label="Go Back"
            onClick={handleCancel}
            className="btn btn-outline"
          />
        </div>
      </div>
    );
  }

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
        <PageHeader title="Edit Tenant" headerBtn={headerButtons} />

        <Form onSubmit={handleSubmit} className="resource-form">
          <PanelsWrapper>
            <Panel variant="alt-2">
              <div className="panel-content">
                <FormSection
                  title="Personal Information"
                  description="Edit tenant personal details"
                >
                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="firstName" label="First Name *" />
                      <FormInput
                        id="firstName"
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        value={formData.personalInfo.firstName}
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
                        value={formData.personalInfo.lastName}
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
                        value={formData.personalInfo.email}
                        onChange={(e) =>
                          handleFieldChange(
                            "personalInfo.email",
                            e.target.value
                          )
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
                        value={formData.personalInfo.phoneNumber}
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

                <FormSection
                  title="Employer Information"
                  description="Tenant employment details (optional)"
                  collapsable={true}
                >
                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="companyName" label="Company Name" />
                      <FormInput
                        id="companyName"
                        type="text"
                        name="companyName"
                        placeholder="Enter company name"
                        value={formData.employerInfo?.companyName || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "employerInfo.companyName",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="position" label="Position" />
                      <FormInput
                        id="position"
                        type="text"
                        name="position"
                        placeholder="Enter position"
                        value={formData.employerInfo?.position || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "employerInfo.position",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>

                  <div className="form-fields">
                    <FormField>
                      <FormLabel
                        htmlFor="monthlyIncome"
                        label="Monthly Income"
                      />
                      <FormInput
                        id="monthlyIncome"
                        type="number"
                        name="monthlyIncome"
                        placeholder="Enter monthly income"
                        value={formData.employerInfo?.monthlyIncome || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "employerInfo.monthlyIncome",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

                <FormSection
                  title="Emergency Contact"
                  description="Emergency contact information (optional)"
                  collapsable={true}
                >
                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="emergencyName" label="Name" />
                      <FormInput
                        id="emergencyName"
                        type="text"
                        name="emergencyName"
                        placeholder="Enter emergency contact name"
                        value={formData.emergencyContact?.name || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "emergencyContact.name",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                    <FormField>
                      <FormLabel
                        htmlFor="emergencyRelationship"
                        label="Relationship"
                      />
                      <FormInput
                        id="emergencyRelationship"
                        type="text"
                        name="emergencyRelationship"
                        placeholder="Enter relationship"
                        value={formData.emergencyContact?.relationship || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "emergencyContact.relationship",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>

                  <div className="form-fields">
                    <FormField>
                      <FormLabel htmlFor="emergencyPhone" label="Phone" />
                      <FormInput
                        id="emergencyPhone"
                        type="tel"
                        name="emergencyPhone"
                        placeholder="Enter phone number"
                        value={formData.emergencyContact?.phone || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "emergencyContact.phone",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                    <FormField>
                      <FormLabel htmlFor="emergencyEmail" label="Email" />
                      <FormInput
                        id="emergencyEmail"
                        type="email"
                        name="emergencyEmail"
                        placeholder="Enter email address"
                        value={formData.emergencyContact?.email || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            "emergencyContact.email",
                            e.target.value
                          )
                        }
                      />
                    </FormField>
                  </div>
                </FormSection>

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
                    disabled={updateTenantMutation.isPending}
                    label="Cancel"
                  />
                  <Button
                    type="submit"
                    className="btn btn-primary"
                    loading={updateTenantMutation.isPending}
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
