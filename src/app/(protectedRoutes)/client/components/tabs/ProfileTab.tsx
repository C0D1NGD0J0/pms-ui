"use client";

import React, { ChangeEvent, useState } from "react";
import { FormSection } from "@components/FormLayout/formSection";
import { IClientFormData, IClient } from "@interfaces/client.interface";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
  Select,
} from "@components/FormElements";

interface ProfileTabProps {
  clientInfo: IClient;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ clientInfo }) => {
  const [formData, setFormData] = useState<Partial<IClientFormData>>({
    displayName: clientInfo.displayName || "",
    accountType: {
      planId: clientInfo.accountType.planId,
      planName: clientInfo.accountType.planName,
      isEnterpriseAccount: clientInfo.accountType.isEnterpriseAccount,
    },
    isVerified: clientInfo.isVerified,
  });

  const handleInputChange = (name: string, value: string | boolean) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof IClientFormData] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (
    name: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    handleInputChange(name, e.target.checked);
  };

  return (
    <div className="resource-form">
      <FormSection
        title="Account Information"
        description="Basic account details and display preferences"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="clientId" label="Client ID" />
            <FormInput
              id="clientId"
              name="clientId"
              value={clientInfo.cid}
              disabled
              readOnly
              placeholder="Client ID"
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="displayName" label="Display Name" />
            <FormInput
              id="displayName"
              name="displayName"
              value={formData.displayName || ""}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              placeholder="Enter display name"
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="accountType" label="Account Type" />
            <Select
              id="accountType"
              name="accountType"
              value={formData.accountType?.planName || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                handleInputChange("accountType.planName", e.target.value)
              }
              options={[
                { value: "personal", label: "Basic" },
                { value: "premium", label: "Premium" },
                { value: "enterprise", label: "Enterprise" },
              ]}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="planId" label="Plan ID" />
            <FormInput
              id="planId"
              name="planId"
              value={formData.accountType?.planId || ""}
              onChange={(e) =>
                handleInputChange("accountType.planId", e.target.value)
              }
              placeholder="Plan identifier"
            />
          </FormField>
        </div>

        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              id="isEnterpriseAccount"
              name="isEnterpriseAccount"
              checked={formData.accountType?.isEnterpriseAccount || false}
              onChange={(e) =>
                handleCheckboxChange("accountType.isEnterpriseAccount", e)
              }
              label="Enterprise Account"
            />
          </FormField>
          <FormField>
            <Checkbox
              id="isVerified"
              name="isVerified"
              checked={formData.isVerified || false}
              onChange={(e) => handleCheckboxChange("isVerified", e)}
              label="Account Verified"
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
