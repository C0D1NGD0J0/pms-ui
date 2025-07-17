"use client";
import React from "react";
import { FormSection } from "@components/FormLayout";
import { IInvitationFormData } from "@interfaces/invitation.interface";
import { FormInput, FormLabel, FormField } from "@components/FormElements";
import {
  FormRadio,
  FileInput,
  Checkbox,
  Textarea,
  Select,
} from "@components/FormElements";

interface VendorDetailsTabProps {
  formData: IInvitationFormData;
  messageCount: number;
  onFieldChange: (field: string, value: any) => void;
  onMessageCountChange: (count: number) => void;
}

export const VendorDetailsTab: React.FC<VendorDetailsTabProps> = ({
  formData,
  messageCount,
  onFieldChange,
  onMessageCountChange,
}) => {
  return (
    <>
      <FormSection
        title="Company Information"
        description="Enter vendor company details"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="companyName" label="Company Name *" />
            <FormInput
              id="companyName"
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={formData.vendorInfo?.companyName || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.companyName", e.target.value)
              }
              required
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="businessType" label="Business Type" />
            <Select
              id="businessType"
              name="businessType"
              value={formData.vendorInfo?.businessType || ""}
              onChange={(value) =>
                onFieldChange("vendorInfo.businessType", value)
              }
              options={[
                { value: "", label: "Select business type" },
                { value: "llc", label: "LLC" },
                { value: "corporation", label: "Corporation" },
                { value: "partnership", label: "Partnership" },
                { value: "sole-proprietorship", label: "Sole Proprietorship" },
                { value: "other", label: "Other" },
              ]}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="taxId" label="Tax ID" />
            <FormInput
              id="taxId"
              type="text"
              name="taxId"
              placeholder="Enter tax ID"
              value={formData.vendorInfo?.taxId || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.taxId", e.target.value)
              }
            />
          </FormField>
          <FormField>
            <FormLabel
              htmlFor="registrationNumber"
              label="Registration Number"
            />
            <FormInput
              id="registrationNumber"
              type="text"
              name="registrationNumber"
              placeholder="Enter registration number"
              value={formData.vendorInfo?.registrationNumber || ""}
              onChange={(e) =>
                onFieldChange("vendorInfo.registrationNumber", e.target.value)
              }
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="yearsInBusiness" label="Years in Business" />
            <FormInput
              id="yearsInBusiness"
              type="number"
              name="yearsInBusiness"
              placeholder="Enter years in business"
              value={formData.vendorInfo?.yearsInBusiness?.toString() || ""}
              onChange={(e) =>
                onFieldChange(
                  "vendorInfo.yearsInBusiness",
                  parseInt(e.target.value) || 0
                )
              }
              min="0"
            />
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Services Offered"
        description="Select all services this vendor can provide"
      >
        <div className="form-fields">
          <FormField>
            <div className="services-grid">
              {[
                { id: "applianceRepair", label: "Appliance Repair" },
                { id: "carpentry", label: "Carpentry" },
                { id: "cleaning", label: "Cleaning" },
                { id: "electrical", label: "Electrical" },
                { id: "hvac", label: "HVAC" },
                { id: "landscaping", label: "Landscaping" },
                { id: "maintenance", label: "Maintenance" },
                { id: "painting", label: "Painting" },
                { id: "pestControl", label: "Pest Control" },
                { id: "plumbing", label: "Plumbing" },
                { id: "roofing", label: "Roofing" },
                { id: "security", label: "Security" },
                { id: "other", label: "Other" },
              ].map((service) => (
                <div key={service.id} className="service-item">
                  <Checkbox
                    id={`service-${service.id}`}
                    name="vendorInfo.servicesOffered"
                    checked={
                      formData.vendorInfo?.servicesOffered?.[service.id] ||
                      false
                    }
                    onChange={(e) => {
                      onFieldChange(
                        `vendorInfo.servicesOffered.${service.id}`,
                        e.target.checked
                      );
                    }}
                    label={service.label}
                  />
                </div>
              ))}
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Service Area"
        description="Select the maximum distance you can travel from your base location"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="serviceArea" label="Maximum Service Distance" />
            <div className="radio-group">
              {[
                { value: 10, label: "Up to 10km" },
                { value: 15, label: "Up to 15km" },
                { value: 25, label: "Up to 25km" },
                { value: 50, label: "Up to 50km" },
              ].map((option) => (
                <FormRadio
                  key={option.value}
                  id={`distance-${option.value}`}
                  name="serviceArea"
                  value={option.value.toString()}
                  checked={
                    formData.vendorInfo?.serviceArea?.maxDistance ===
                    option.value
                  }
                  onChange={() =>
                    onFieldChange(
                      "vendorInfo.serviceArea.maxDistance",
                      option.value
                    )
                  }
                  label={option.label}
                />
              ))}
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Insurance Information"
        description="Indicate if you have insurance and provide details"
      >
        <div className="form-fields">
          <FormField>
            <Checkbox
              id="hasInsurance"
              name="hasInsurance"
              checked={
                formData.vendorInfo?.insuranceInfo?.hasInsurance || false
              }
              onChange={(e) =>
                onFieldChange(
                  "vendorInfo.insuranceInfo.hasInsurance",
                  e.target.checked
                )
              }
              label="This vendor has insurance coverage"
            />
          </FormField>
        </div>

        {formData.vendorInfo?.insuranceInfo?.hasInsurance && (
          <div className="form-fields">
            <FormField>
              <div className="insurance-group">
                <h4>Insurance Details</h4>
                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor="insuranceProvider"
                      label="Insurance Provider"
                    />
                    <FormInput
                      id="insuranceProvider"
                      type="text"
                      name="insuranceProvider"
                      placeholder="Enter insurance provider name"
                      value={formData.vendorInfo?.insuranceInfo?.provider || ""}
                      onChange={(e) =>
                        onFieldChange(
                          "vendorInfo.insuranceInfo.provider",
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="policyNumber" label="Policy Number" />
                    <FormInput
                      id="policyNumber"
                      type="text"
                      name="policyNumber"
                      placeholder="Enter policy number"
                      value={
                        formData.vendorInfo?.insuranceInfo?.policyNumber || ""
                      }
                      onChange={(e) =>
                        onFieldChange(
                          "vendorInfo.insuranceInfo.policyNumber",
                          e.target.value
                        )
                      }
                    />
                  </FormField>
                </div>
                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor="coverageAmount"
                      label="Coverage Amount"
                    />
                    <FormInput
                      id="coverageAmount"
                      type="number"
                      name="coverageAmount"
                      placeholder="Enter coverage amount"
                      value={
                        formData.vendorInfo?.insuranceInfo?.coverageAmount?.toString() ||
                        ""
                      }
                      onChange={(e) =>
                        onFieldChange(
                          "vendorInfo.insuranceInfo.coverageAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      min="0"
                    />
                  </FormField>
                  <FormField>
                    <FormLabel
                      htmlFor="expirationDate"
                      label="Expiration Date"
                    />
                    <FormInput
                      id="expirationDate"
                      type="date"
                      name="expirationDate"
                      value={
                        formData.vendorInfo?.insuranceInfo?.expirationDate
                          ? new Date(
                              formData.vendorInfo.insuranceInfo.expirationDate
                            )
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        onFieldChange(
                          "vendorInfo.insuranceInfo.expirationDate",
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                    />
                  </FormField>
                </div>
                <div className="form-fields">
                  <FormField>
                    <FormLabel
                      htmlFor="insuranceDocument"
                      label="Insurance Document"
                    />
                    <FileInput
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      instructionText="Upload insurance certificate or policy document (PDF, JPG, PNG, DOC, DOCX)"
                      onChange={(file) => {
                        if (file) {
                          onFieldChange(
                            "vendorInfo.insuranceInfo.documentName",
                            file.name
                          );
                          onFieldChange(
                            "vendorInfo.insuranceInfo.documentUrl",
                            URL.createObjectURL(file)
                          );
                        } else {
                          onFieldChange(
                            "vendorInfo.insuranceInfo.documentName",
                            ""
                          );
                          onFieldChange(
                            "vendorInfo.insuranceInfo.documentUrl",
                            ""
                          );
                        }
                      }}
                    />
                  </FormField>
                </div>
              </div>
            </FormField>
          </div>
        )}
      </FormSection>

      <FormSection
        title="Contact Person"
        description="Primary contact person for this vendor"
      >
        <div className="form-fields">
          <FormField>
            <div className="contact-person-group">
              <h4>Contact Information</h4>
              <div className="form-fields">
                <FormField>
                  <FormLabel htmlFor="contactName" label="Contact Name *" />
                  <FormInput
                    id="contactName"
                    type="text"
                    name="contactName"
                    placeholder="Enter contact person name"
                    value={formData.vendorInfo?.contactPerson?.name || ""}
                    onChange={(e) =>
                      onFieldChange(
                        "vendorInfo.contactPerson.name",
                        e.target.value
                      )
                    }
                    required
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="contactJobTitle" label="Job Title *" />
                  <FormInput
                    id="contactJobTitle"
                    type="text"
                    name="contactJobTitle"
                    placeholder="Enter job title"
                    value={formData.vendorInfo?.contactPerson?.jobTitle || ""}
                    onChange={(e) =>
                      onFieldChange(
                        "vendorInfo.contactPerson.jobTitle",
                        e.target.value
                      )
                    }
                    required
                  />
                </FormField>
              </div>
              <div className="form-fields">
                <FormField>
                  <FormLabel htmlFor="contactEmail" label="Contact Email" />
                  <FormInput
                    id="contactEmail"
                    type="email"
                    name="contactEmail"
                    placeholder="Enter contact email"
                    value={formData.vendorInfo?.contactPerson?.email || ""}
                    onChange={(e) =>
                      onFieldChange(
                        "vendorInfo.contactPerson.email",
                        e.target.value
                      )
                    }
                  />
                </FormField>
                <FormField>
                  <FormLabel htmlFor="contactPhone" label="Contact Phone" />
                  <FormInput
                    id="contactPhone"
                    type="tel"
                    name="contactPhone"
                    placeholder="Enter contact phone"
                    value={formData.vendorInfo?.contactPerson?.phone || ""}
                    onChange={(e) =>
                      onFieldChange(
                        "vendorInfo.contactPerson.phone",
                        e.target.value
                      )
                    }
                  />
                </FormField>
              </div>
              <div className="form-fields">
                <FormField>
                  <FormLabel htmlFor="contactDepartment" label="Department" />
                  <FormInput
                    id="contactDepartment"
                    type="text"
                    name="contactDepartment"
                    placeholder="Enter department"
                    value={formData.vendorInfo?.contactPerson?.department || ""}
                    onChange={(e) =>
                      onFieldChange(
                        "vendorInfo.contactPerson.department",
                        e.target.value
                      )
                    }
                  />
                </FormField>
              </div>
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection
        title="Additional Information"
        description="Optional details to include with the invitation"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="inviteMessage" label="Personal Message" />
            <Textarea
              id="inviteMessage"
              name="inviteMessage"
              rows={5}
              placeholder="Add a personal message to the invitation (optional)"
              value={formData.metadata?.inviteMessage || ""}
              onChange={(e: any) => {
                onFieldChange("metadata.inviteMessage", e.target.value);
                onMessageCountChange(e.target.value.length);
              }}
              maxLength={500}
            />
            <small style={{ color: "#7d8da1", fontSize: "12px" }}>
              {messageCount}/500 characters
            </small>
          </FormField>
        </div>
      </FormSection>
    </>
  );
};
