import React from "react";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues, UtilityEnum } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  TextArea,
  Checkbox,
  Toggle,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
  handleUtilityToggle: (utility: UtilityEnum, checked: boolean) => void;
}

export const AdditionalTermsTab = ({
  leaseForm,
  handleOnChange,
  handleUtilityToggle,
}: Props) => {
  const petPolicyAllowed = leaseForm.values.petPolicy?.allowed || false;
  const autoRenew = leaseForm.values.renewalOptions?.autoRenew || false;

  const utilities = [
    { value: UtilityEnum.WATER, label: "Water" },
    { value: UtilityEnum.GAS, label: "Gas" },
    { value: UtilityEnum.ELECTRICITY, label: "Electricity" },
    { value: UtilityEnum.INTERNET, label: "Internet" },
    { value: UtilityEnum.CABLE, label: "Cable" },
    { value: UtilityEnum.TRASH, label: "Trash" },
    { value: UtilityEnum.SEWER, label: "Sewer" },
    { value: UtilityEnum.HEATING, label: "Heating" },
    { value: UtilityEnum.COOLING, label: "Cooling" },
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
                checked={
                  leaseForm.values.utilitiesIncluded?.includes(
                    utility.value as any
                  ) || false
                }
                onChange={(e) =>
                  handleUtilityToggle(utility.value, e.target.checked)
                }
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
            onChange={(checked) => handleOnChange(checked, "petPolicy.allowed")}
          />
        </div>

        {petPolicyAllowed && (
          <>
            <div className="form-fields">
              <FormField
                error={{
                  msg: (leaseForm.errors["petPolicy.maxPets"] as string) || "",
                  touched: leaseForm.isTouched("petPolicy.maxPets"),
                }}
              >
                <FormLabel htmlFor="maxPets" label="Maximum Number of Pets" />
                <FormInput
                  id="maxPets"
                  name="petPolicy.maxPets"
                  type="number"
                  onChange={handleOnChange}
                  placeholder="Enter max number of pets"
                  value={leaseForm.values.petPolicy?.maxPets?.toString() || ""}
                  hasError={!!leaseForm.errors["petPolicy.maxPets"]}
                  min="1"
                />
              </FormField>
              <FormField
                error={{
                  msg: (leaseForm.errors["petPolicy.types"] as string) || "",
                  touched: leaseForm.isTouched("petPolicy.types"),
                }}
              >
                <FormLabel htmlFor="petTypes" label="Allowed Pet Types" />
                <FormInput
                  id="petTypes"
                  name="petPolicy.types"
                  type="text"
                  onChange={handleOnChange}
                  placeholder="e.g., Dogs, Cats"
                  value={
                    Array.isArray(leaseForm.values.petPolicy?.types)
                      ? leaseForm.values.petPolicy.types.join(", ")
                      : leaseForm.values.petPolicy?.types || ""
                  }
                  hasError={!!leaseForm.errors["petPolicy.types"]}
                />
              </FormField>
            </div>

            <div className="form-fields">
              <FormField
                error={{
                  msg: (leaseForm.errors["petPolicy.deposit"] as string) || "",
                  touched: leaseForm.isTouched("petPolicy.deposit"),
                }}
              >
                <FormLabel htmlFor="petDeposit" label="Pet Deposit" />
                <FormInput
                  id="petDeposit"
                  name="petPolicy.deposit"
                  type="number"
                  onChange={handleOnChange}
                  placeholder="Enter pet deposit amount"
                  value={leaseForm.values.petPolicy?.deposit?.toString() || ""}
                  hasError={!!leaseForm.errors["petPolicy.deposit"]}
                  min="0"
                  step="0.01"
                />
              </FormField>
              <FormField
                error={{
                  msg:
                    (leaseForm.errors["petPolicy.monthlyFee"] as string) || "",
                  touched: leaseForm.isTouched("petPolicy.monthlyFee"),
                }}
              >
                <FormLabel htmlFor="petMonthlyFee" label="Monthly Pet Fee" />
                <FormInput
                  id="petMonthlyFee"
                  name="petPolicy.monthlyFee"
                  type="number"
                  onChange={handleOnChange}
                  placeholder="Enter monthly pet fee"
                  value={
                    leaseForm.values.petPolicy?.monthlyFee?.toString() || ""
                  }
                  hasError={!!leaseForm.errors["petPolicy.monthlyFee"]}
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
            onChange={(checked) =>
              handleOnChange(checked, "renewalOptions.autoRenew")
            }
          />
        </div>

        {autoRenew && (
          <div className="form-fields">
            <FormField
              error={{
                msg:
                  (leaseForm.errors[
                    "renewalOptions.noticePeriodDays"
                  ] as string) || "",
                touched: leaseForm.isTouched("renewalOptions.noticePeriodDays"),
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
                onChange={handleOnChange}
                placeholder="Days before end date"
                value={
                  leaseForm.values.renewalOptions?.noticePeriodDays?.toString() ||
                  ""
                }
                hasError={!!leaseForm.errors["renewalOptions.noticePeriodDays"]}
                min="1"
              />
            </FormField>
            <FormField
              error={{
                msg:
                  (leaseForm.errors[
                    "renewalOptions.renewalTermMonths"
                  ] as string) || "",
                touched: leaseForm.isTouched(
                  "renewalOptions.renewalTermMonths"
                ),
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
                onChange={handleOnChange}
                placeholder="Length of renewal term"
                value={
                  leaseForm.values.renewalOptions?.renewalTermMonths?.toString() ||
                  ""
                }
                hasError={
                  !!leaseForm.errors["renewalOptions.renewalTermMonths"]
                }
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
              msg: (leaseForm.errors.internalNotes as string) || "",
              touched: leaseForm.isTouched("internalNotes"),
            }}
          >
            <FormLabel htmlFor="internalNotes" label="Notes" />
            <TextArea
              id="internalNotes"
              name="internalNotes"
              onChange={handleOnChange}
              placeholder="Add any internal notes about this lease (for internal use only)..."
              value={leaseForm.values.internalNotes || ""}
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
              {leaseForm.values.internalNotes?.length || 0} / 2000 characters
            </p>
          </FormField>
        </div>
      </div>
    </>
  );
};
