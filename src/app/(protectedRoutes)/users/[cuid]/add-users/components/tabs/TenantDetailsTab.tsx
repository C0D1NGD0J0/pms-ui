"use client";
import React, { useState } from "react";
import { FormSection } from "@components/FormLayout";
import { Button } from "@components/FormElements";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { FormInput, FormLabel, FormField } from "@components/FormElements";

interface TenantDetailsTabProps {
  formData: IInvitationFormData;
  onFieldChange: (field: string, value: any) => void;
}

export const TenantDetailsTab: React.FC<TenantDetailsTabProps> = ({
  formData,
  onFieldChange,
}) => {
  const rentalReferences = formData.tenantInfo?.rentalReferences || [];

  const addRentalReference = () => {
    const newReferences = [
      ...rentalReferences,
      {
        landlordName: "",
        landlordEmail: "",
        landlordContact: "",
        durationMonths: undefined,
        reasonForLeaving: "",
        propertyAddress: "",
      },
    ];
    onFieldChange("tenantInfo.rentalReferences", newReferences);
  };

  const removeRentalReference = (index: number) => {
    const newReferences = rentalReferences.filter((_, i) => i !== index);
    onFieldChange("tenantInfo.rentalReferences", newReferences);
  };

  const updateRentalReference = (index: number, field: string, value: any) => {
    const newReferences = [...rentalReferences];
    newReferences[index] = {
      ...newReferences[index],
      [field]: value,
    };
    onFieldChange("tenantInfo.rentalReferences", newReferences);
  };

  return (
    <>
      {/* Employer Information Section - Optional */}
      <FormSection
        title="Employment Information"
        description="Optional: Provide employment details for tenant screening"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="employerCompanyName" label="Company Name" />
            <FormInput
              id="employerCompanyName"
              type="text"
              name="employerCompanyName"
              placeholder="Enter company name"
              value={formData.tenantInfo?.employerInfo?.companyName || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.employerInfo.companyName", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="employerPosition" label="Position/Job Title" />
            <FormInput
              id="employerPosition"
              type="text"
              name="employerPosition"
              placeholder="Enter position"
              value={formData.tenantInfo?.employerInfo?.position || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.employerInfo.position", e.target.value)
              }
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="monthlyIncome" label="Monthly Income ($)" />
            <FormInput
              id="monthlyIncome"
              type="number"
              name="monthlyIncome"
              placeholder="Enter monthly income"
              min="0"
              step="0.01"
              value={formData.tenantInfo?.employerInfo?.monthlyIncome || ""}
              onChange={(e) =>
                onFieldChange(
                  "tenantInfo.employerInfo.monthlyIncome",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyRef" label="Company Reference/Contact" />
            <FormInput
              id="companyRef"
              type="text"
              name="companyRef"
              placeholder="Enter reference name"
              value={formData.tenantInfo?.employerInfo?.companyRef || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.employerInfo.companyRef", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="refContactEmail" label="Reference Contact Email" />
            <FormInput
              id="refContactEmail"
              type="email"
              name="refContactEmail"
              placeholder="Enter reference email"
              value={formData.tenantInfo?.employerInfo?.refContactEmail || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.employerInfo.refContactEmail", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>

      {/* Emergency Contact Section - Optional */}
      <FormSection
        title="Emergency Contact"
        description="Optional: Provide emergency contact information"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="emergencyContactName" label="Full Name" />
            <FormInput
              id="emergencyContactName"
              type="text"
              name="emergencyContactName"
              placeholder="Enter contact name"
              value={formData.tenantInfo?.emergencyContact?.name || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.emergencyContact.name", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="emergencyContactPhone" label="Phone Number" />
            <FormInput
              id="emergencyContactPhone"
              type="tel"
              name="emergencyContactPhone"
              placeholder="Enter contact phone"
              value={formData.tenantInfo?.emergencyContact?.phone || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.emergencyContact.phone", e.target.value)
              }
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="emergencyContactRelationship" label="Relationship" />
            <FormInput
              id="emergencyContactRelationship"
              type="text"
              name="emergencyContactRelationship"
              placeholder="e.g., Spouse, Parent, Sibling"
              value={formData.tenantInfo?.emergencyContact?.relationship || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.emergencyContact.relationship", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="emergencyContactEmail" label="Email Address" />
            <FormInput
              id="emergencyContactEmail"
              type="email"
              name="emergencyContactEmail"
              placeholder="Enter contact email"
              value={formData.tenantInfo?.emergencyContact?.email || ""}
              onChange={(e) =>
                onFieldChange("tenantInfo.emergencyContact.email", e.target.value)
              }
            />
          </FormField>
        </div>
      </FormSection>

      {/* Rental References Section - Optional */}
      <FormSection
        title="Rental References"
        description="Optional: Add previous landlord references (tenant can complete this later)"
      >
        {rentalReferences.length === 0 ? (
          <div className="empty-state" style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              No rental references added yet. Click the button below to add a reference.
            </p>
            <Button
              type="button"
              label="Add Rental Reference"
              className="btn-outline"
              icon={<i className="bx bx-plus"></i>}
              onClick={addRentalReference}
            />
          </div>
        ) : (
          <>
            {rentalReferences.map((reference, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>
                    Reference #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    label="Remove"
                    className="btn-outline-ghost"
                    icon={<i className="bx bx-trash"></i>}
                    onClick={() => removeRentalReference(index)}
                  />
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor={`landlordName-${index}`}
                      label="Landlord Name"
                    />
                    <FormInput
                      id={`landlordName-${index}`}
                      type="text"
                      name={`landlordName-${index}`}
                      placeholder="Enter landlord name"
                      value={reference.landlordName || ""}
                      onChange={(e) =>
                        updateRentalReference(index, "landlordName", e.target.value)
                      }
                    />
                  </FormField>
                  <FormField>
                    <FormLabel
                      htmlFor={`landlordContact-${index}`}
                      label="Landlord Phone"
                    />
                    <FormInput
                      id={`landlordContact-${index}`}
                      type="tel"
                      name={`landlordContact-${index}`}
                      placeholder="Enter phone number"
                      value={reference.landlordContact || ""}
                      onChange={(e) =>
                        updateRentalReference(index, "landlordContact", e.target.value)
                      }
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor={`landlordEmail-${index}`}
                      label="Landlord Email"
                    />
                    <FormInput
                      id={`landlordEmail-${index}`}
                      type="email"
                      name={`landlordEmail-${index}`}
                      placeholder="Enter email address"
                      value={reference.landlordEmail || ""}
                      onChange={(e) =>
                        updateRentalReference(index, "landlordEmail", e.target.value)
                      }
                    />
                  </FormField>
                  <FormField>
                    <FormLabel
                      htmlFor={`propertyAddress-${index}`}
                      label="Property Address"
                    />
                    <FormInput
                      id={`propertyAddress-${index}`}
                      type="text"
                      name={`propertyAddress-${index}`}
                      placeholder="Enter property address"
                      value={reference.propertyAddress || ""}
                      onChange={(e) =>
                        updateRentalReference(index, "propertyAddress", e.target.value)
                      }
                    />
                  </FormField>
                </div>

                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor={`durationMonths-${index}`}
                      label="Duration (Months)"
                    />
                    <FormInput
                      id={`durationMonths-${index}`}
                      type="number"
                      name={`durationMonths-${index}`}
                      placeholder="e.g., 12"
                      min="1"
                      max="120"
                      value={reference.durationMonths || ""}
                      onChange={(e) =>
                        updateRentalReference(
                          index,
                          "durationMonths",
                          e.target.value ? parseInt(e.target.value, 10) : undefined
                        )
                      }
                    />
                  </FormField>
                  <FormField>
                    <FormLabel
                      htmlFor={`reasonForLeaving-${index}`}
                      label="Reason for Leaving"
                    />
                    <FormInput
                      id={`reasonForLeaving-${index}`}
                      type="text"
                      name={`reasonForLeaving-${index}`}
                      placeholder="Optional"
                      value={reference.reasonForLeaving || ""}
                      onChange={(e) =>
                        updateRentalReference(index, "reasonForLeaving", e.target.value)
                      }
                    />
                  </FormField>
                </div>
              </div>
            ))}

            <Button
              type="button"
              label="Add Another Reference"
              className="btn-outline"
              icon={<i className="bx bx-plus"></i>}
              onClick={addRentalReference}
            />
          </>
        )}
      </FormSection>
    </>
  );
};
