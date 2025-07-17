"use client";
import React from "react";
import { FormSection } from "@components/FormLayout";
import { FormLabel, FormField } from "@components/FormElements";
import {
  IInvitationFormData,
  IUserRole,
} from "@interfaces/invitation.interface";

interface ReviewTabProps {
  formData: IInvitationFormData;
  selectedRole: IUserRole | null;
}

export const ReviewTab: React.FC<ReviewTabProps> = ({
  formData,
  selectedRole,
}) => {
  return (
    <FormSection
      title="Invitation Summary"
      description="Review the invitation details before sending"
    >
      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="summary-recipient" label="Recipient" />
          <div className="summary-value" id="summary-recipient">
            {formData.personalInfo.firstName || formData.personalInfo.lastName
              ? `${formData.personalInfo.firstName} ${formData.personalInfo.lastName} (${formData.inviteeEmail})`
              : formData.inviteeEmail ||
                "Complete the basic information to see recipient details"}
          </div>
        </FormField>
      </div>

      <div className="form-fields">
        <FormField>
          <FormLabel htmlFor="summary-role" label="Role" />
          <div className="summary-value" id="summary-role">
            {selectedRole || "No role selected"}
          </div>
        </FormField>
      </div>

      {formData.metadata?.expectedStartDate && (
        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="summary-start-date"
              label="Expected Start Date"
            />
            <div className="summary-value" id="summary-start-date">
              {(() => {
                const startDate = formData.metadata.expectedStartDate;
                // Handle both string and Date formats
                const dateObj =
                  startDate instanceof Date ? startDate : new Date(startDate);

                // Check if the date is valid
                if (isNaN(dateObj.getTime())) {
                  return typeof startDate === "string"
                    ? startDate
                    : String(startDate);
                }

                return dateObj.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });
              })()}
            </div>
          </FormField>
        </div>
      )}

      {formData.metadata?.inviteMessage && (
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="summary-message" label="Personal Message" />
            <div className="summary-value" id="summary-message">
              {formData.metadata.inviteMessage}
            </div>
          </FormField>
        </div>
      )}
    </FormSection>
  );
};
