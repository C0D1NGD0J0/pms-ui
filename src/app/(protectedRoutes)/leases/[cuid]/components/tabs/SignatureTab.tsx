import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { FormField, FormLabel, Select } from "@components/FormElements";
import {
  SigningMethodEnum,
  LeaseFormValues,
} from "@interfaces/lease.interface";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const SignatureTab = ({ leaseForm, handleOnChange }: Props) => {
  const signingMethodOptions = [
    { value: "", label: "Select signing method" },
    {
      value: SigningMethodEnum.ELECTRONIC,
      label: "Electronic Signature",
    },
    {
      value: SigningMethodEnum.MANUAL,
      label: "Manual Signature (Print & Sign)",
    },
    {
      value: SigningMethodEnum.PENDING,
      label: "Decide Later",
    },
  ];

  return (
    <>
      {/* Info Banner */}
      <div className="info-banner">
        <p>
          <strong>About Signature Methods:</strong>
        </p>
        <ul>
          <li>
            <strong>Electronic Signature:</strong> Send lease via email for
            online signing (recommended)
          </li>
          <li>
            <strong>Manual Signature:</strong> Print and physically sign the
            lease document
          </li>
          <li>
            <strong>Decide Later:</strong> Choose the signing method after lease
            creation
          </li>
        </ul>
      </div>

      <div className="form-fields">
        <FormField
          error={{
            msg: (leaseForm.errors.signingMethod as string) || "",
            touched: leaseForm.isTouched("signingMethod"),
          }}
        >
          <FormLabel htmlFor="signingMethod" label="Signing Method" />
          <Select
            id="signingMethod"
            name="signingMethod"
            onChange={(value: string | React.ChangeEvent<HTMLSelectElement>) =>
              handleOnChange(value, "signingMethod")
            }
            options={signingMethodOptions}
            placeholder="Select how this lease will be signed"
            value={leaseForm.values.signingMethod || ""}
          />
        </FormField>
      </div>
    </>
  );
};
