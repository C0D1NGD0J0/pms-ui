import React, { useState } from "react";
import {
  FormField,
  FormLabel,
  FormInput,
  TextArea,
  Checkbox,
  Toggle,
} from "@components/FormElements";

export const AdditionalTermsTab = () => {
  const [petPolicyAllowed, setPetPolicyAllowed] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);

  const utilities = [
    { value: "water", label: "Water" },
    { value: "gas", label: "Gas" },
    { value: "electricity", label: "Electricity" },
    { value: "internet", label: "Internet" },
    { value: "cable", label: "Cable" },
    { value: "trash", label: "Trash" },
    { value: "sewer", label: "Sewer" },
    { value: "heating", label: "Heating" },
    { value: "cooling", label: "Cooling" },
  ];

  return (
    <>
      {/* Utilities Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Utilities Included
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {utilities.map((utility) => (
            <FormField
              key={utility.value}
              error={{
                msg: "",
                touched: false,
              }}
            >
              <Checkbox
                id={`utility-${utility.value}`}
                name={`utilitiesIncluded.${utility.value}`}
                label={utility.label}
                checked={false}
                onChange={() => {}}
              />
            </FormField>
          ))}
        </div>
      </div>

      {/* Pet Policy Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Pet Policy
        </h4>
        <div className="toggle-container">
          <div className="toggle-label">
            <h4>Pets Allowed</h4>
            <p>Allow pets in this property</p>
          </div>
          <Toggle
            id="petPolicyAllowed"
            name="petPolicy.allowed"
            initialState={petPolicyAllowed}
            onChange={(checked) => setPetPolicyAllowed(checked)}
          />
        </div>

        {petPolicyAllowed && (
          <>
            <div className="form-fields">
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="maxPets" label="Maximum Number of Pets" />
                <FormInput
                  id="maxPets"
                  name="petPolicy.maxPets"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter max number of pets"
                  value=""
                  hasError={false}
                  min="1"
                />
              </FormField>
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petTypes" label="Allowed Pet Types" />
                <FormInput
                  id="petTypes"
                  name="petPolicy.types"
                  type="text"
                  onChange={() => {}}
                  placeholder="e.g., Dogs, Cats"
                  value=""
                  hasError={false}
                />
              </FormField>
            </div>

            <div className="form-fields">
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petDeposit" label="Pet Deposit" />
                <FormInput
                  id="petDeposit"
                  name="petPolicy.deposit"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter pet deposit amount"
                  value=""
                  hasError={false}
                  min="0"
                  step="0.01"
                />
              </FormField>
              <FormField
                error={{
                  msg: "",
                  touched: false,
                }}
              >
                <FormLabel htmlFor="petMonthlyFee" label="Monthly Pet Fee" />
                <FormInput
                  id="petMonthlyFee"
                  name="petPolicy.monthlyFee"
                  type="number"
                  onChange={() => {}}
                  placeholder="Enter monthly pet fee"
                  value=""
                  hasError={false}
                  min="0"
                  step="0.01"
                />
              </FormField>
            </div>
          </>
        )}
      </div>

      {/* Renewal Options Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Renewal Options
        </h4>
        <div className="toggle-container">
          <div className="toggle-label">
            <h4>Auto-Renew</h4>
            <p>Automatically renew this lease when it expires</p>
          </div>
          <Toggle
            id="autoRenew"
            name="renewalOptions.autoRenew"
            initialState={autoRenew}
            onChange={(checked) => setAutoRenew(checked)}
          />
        </div>

        {autoRenew && (
          <div className="form-fields">
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor="noticePeriodDays"
                label="Notice Period (Days)"
              />
              <FormInput
                id="noticePeriodDays"
                name="renewalOptions.noticePeriodDays"
                type="number"
                onChange={() => {}}
                placeholder="Days before end date"
                value=""
                hasError={false}
                min="1"
              />
            </FormField>
            <FormField
              error={{
                msg: "",
                touched: false,
              }}
            >
              <FormLabel
                htmlFor="renewalTermMonths"
                label="Renewal Term (Months)"
              />
              <FormInput
                id="renewalTermMonths"
                name="renewalOptions.renewalTermMonths"
                type="number"
                onChange={() => {}}
                placeholder="Length of renewal term"
                value=""
                hasError={false}
                min="1"
              />
            </FormField>
          </div>
        )}
      </div>

      {/* Internal Notes Section */}
      <div>
        <h4 style={{ marginBottom: "1rem", fontSize: "1rem", fontWeight: 600 }}>
          Internal Notes
        </h4>
        <div className="form-fields">
          <FormField
            error={{
              msg: "",
              touched: false,
            }}
          >
            <FormLabel htmlFor="internalNotes" label="Notes" />
            <TextArea
              id="internalNotes"
              name="internalNotes"
              onChange={() => {}}
              placeholder="Add any internal notes about this lease (for internal use only)..."
              value=""
              rows={4}
              maxLength={2000}
            />
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                textAlign: "right",
              }}
            >
              0 / 2000 characters
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};
