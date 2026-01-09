"use client";
import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { ISignupForm } from "@interfaces/auth.interface";
import { AuthIconInput } from "@components/FormElements";

export default function CompanyInfo({
  formContext,
  onChange,
}: {
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => void;
  formContext: UseFormReturnType<
    ISignupForm,
    (values: ISignupForm) => ISignupForm
  >;
}) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <AuthIconInput
          label="Registered Name"
          type="text"
          icon="bx-buildings"
          placeholder="Enter registered name"
          name="companyProfile.legalEntityName"
          value={formContext.values.companyProfile?.legalEntityName || ""}
          onChange={onChange}
          error={formContext.errors["companyProfile.legalEntityName"] as string}
        />
        <AuthIconInput
          label="Trading Name"
          type="text"
          icon="bx-store"
          placeholder="Enter trading name"
          name="companyProfile.tradingName"
          value={formContext.values.companyProfile?.tradingName || ""}
          onChange={onChange}
          error={formContext.errors["companyProfile.tradingName"] as string}
        />
      </div>

      <AuthIconInput
        label="Business Email"
        type="email"
        icon="bx-envelope"
        placeholder="Enter business email"
        name="companyProfile.companyEmail"
        value={formContext.values.companyProfile?.companyEmail || ""}
        onChange={onChange}
        error={formContext.errors["companyProfile.companyEmail"] as string}
        autoComplete="email"
      />

      <AuthIconInput
        label="Business Phone Number"
        type="tel"
        icon="bx-phone"
        placeholder="Enter business phone"
        name="companyProfile.companyPhone"
        value={formContext.values.companyProfile?.companyPhone || ""}
        onChange={(e) =>
          onChange({
            target: {
              name: e.target.name,
              value: `+${e.target.value.replace(/\D/g, "")}`,
            },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        error={formContext.errors["companyProfile.companyPhone"] as string}
        autoComplete="tel"
      />

      <AuthIconInput
        label="Business Website (Optional)"
        type="url"
        icon="bx-globe"
        placeholder="Enter business website"
        name="companyProfile.website"
        value={formContext.values.companyProfile?.website || ""}
        onChange={onChange}
        error={formContext.errors["companyProfile.website"] as string}
      />
    </>
  );
}
