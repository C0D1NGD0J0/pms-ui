"use client";

import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { IClient } from "@interfaces/client.interface";
import { FormSection } from "@components/FormLayout/formSection";
import { UpdateClientDetailsFormData } from "@src/validations/client.validations";
import {
  FormField,
  FormInput,
  FormLabel,
  Checkbox,
} from "@components/FormElements";

interface ProfileTabProps {
  inEditMode: boolean;
  clientInfo: IClient;
  clientForm: UseFormReturnType<UpdateClientDetailsFormData> | undefined;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  clientForm,
  clientInfo,
  inEditMode = false,
}) => {
  const form = clientForm;
  if (!form) {
    return null;
  }

  return (
    <div className="resource-form">
      <FormSection
        title="Account Information"
        description="Basic account details and display preferences"
      >
        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="cuid" label="Client ID" />
            <FormInput
              disabled
              readOnly
              id="cuid"
              name="cuid"
              value={clientInfo.cuid}
              placeholder="Client ID"
            />
          </FormField>
          <FormField
            error={{
              msg: (form.errors["displayName"] as string) || "",
              touched: form.isTouched("displayName"),
            }}
          >
            <FormLabel htmlFor="displayName" label="Display Name" />
            <FormInput
              id="displayName"
              name="displayName"
              placeholder="Enter display name"
              value={form.values.displayName}
              onChange={(e) =>
                form.setFieldValue("displayName", e.target.value)
              }
              disabled={inEditMode}
              hasError={!!form.errors.displayName}
            />
          </FormField>
        </div>

        <div className="form-fields">
          <FormField>
            <FormLabel htmlFor="accountType" label="Account Type" />
            <FormInput
              id="accountType"
              name="accountType"
              placeholder="Enter account type"
              value={clientInfo.accountType.category}
              onChange={() => ""}
              disabled={inEditMode}
              hasError={false}
            />
          </FormField>
        </div>

        <div className="form-fields checkbox-fields">
          <FormField>
            <Checkbox
              disabled
              onChange={() => {}}
              id="isEnterpriseAccount"
              label="Enterprise Account"
              name="isEnterpriseAccount"
              checked={clientInfo.accountType.category === "business"}
            />
          </FormField>
          <FormField>
            <Checkbox
              disabled
              id="isVerified"
              name="isVerified"
              label="Account Verified"
              onChange={() => {}}
              checked={(clientInfo as IClient).isVerified || false}
            />
          </FormField>
        </div>
      </FormSection>
    </div>
  );
};
