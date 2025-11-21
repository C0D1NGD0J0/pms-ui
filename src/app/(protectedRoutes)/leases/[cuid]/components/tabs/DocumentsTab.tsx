import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { FormField, FormLabel, FileInput } from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const DocumentsTab = ({ leaseForm, handleOnChange }: Props) => {
  return (
    <>
      <div className="mb-4">
        <h4 className="mb-2">Lease Documents</h4>
        <div className="form-fields">
          <FormField
            error={{
              msg: (leaseForm.errors.leaseDocument as string) || "",
              touched: leaseForm.isTouched("leaseDocument"),
            }}
          >
            <FormLabel htmlFor="leaseDocuments" label="Upload Documents" />
            <FileInput
              onChange={(files) => handleOnChange(files, "leaseDocument")}
              accept=".pdf,.doc,.docx"
              multiImage={true}
              instructionText="Select lease agreements and related documents"
              maxFiles={10}
              totalSizeAllowed={50}
            />
            <p className="muted mt-1 text-small">
              Upload lease agreements, addendums, or other related documents
              (PDF, DOC, DOCX)
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};
