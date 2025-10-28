import React from "react";
import { FormField, FormLabel, FileInput } from "@components/FormElements";

export const DocumentsTab = () => {
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Lease Documents
        </h4>
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="leaseDocuments" label="Upload Documents" />
            <FileInput
              onChange={() => {}}
              accept=".pdf,.doc,.docx"
              multiImage={true}
              instructionText="Select lease agreements and related documents"
              maxFiles={10}
              totalSizeAllowed={50}
              onError={(message) =>
                console.error("File upload error:", message)
              }
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
              }}
            >
              Upload lease agreements, addendums, or other related documents
              (PDF, DOC, DOCX)
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};
