import React from "react";
import { Icon } from "@components/Icon";
import { UseFormReturnType } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import {
  FormField,
  FormLabel,
  FormInput,
  Tooltip,
  Toggle,
} from "@components/FormElements";

interface Props {
  leaseForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  >;
  handleOnChange: (e: any, field?: string) => void;
}

export const RenewalOptionsTab = ({ leaseForm, handleOnChange }: Props) => {
  const autoRenew = leaseForm.values.renewalOptions?.autoRenew || false;

  return (
    <>
      <div className="banner banner-info mb-4">
        <div className="banner-content">
          <div className="banner-content__icon">
            <Icon name="bx-info-circle" />
          </div>
          <div className="banner-content__info">
            <h4 className="mb-1">Admin Configuration</h4>
            <p className="mb-0">
              These renewal automation settings control how the system handles
              lease renewals. Only administrators can configure these options.
            </p>
          </div>
        </div>
      </div>

      {/* Auto-Renew Toggle */}
      <div className="mb-4">
        <h4 className="mb-2">Renewal Settings</h4>
        <div className="toggle-container">
          <div className="toggle-label">
            <h4>Enable Auto-Renewal</h4>
            <p>Automatically process lease renewals when conditions are met</p>
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
      </div>

      {autoRenew && (
        <>
          {/* Basic Renewal Options */}
          <div className="mb-4">
            <h4 className="mb-2">Basic Renewal Terms</h4>
            <p className="muted mb-3">
              Configure the basic terms for lease renewals
            </p>
            <div className="form-fields">
              <FormField
                error={{
                  msg:
                    (leaseForm.errors[
                      "renewalOptions.noticePeriodDays"
                    ] as string) || "",
                  touched: leaseForm.isTouched(
                    "renewalOptions.noticePeriodDays"
                  ),
                }}
              >
                <FormLabel
                  htmlFor="noticePeriodDays"
                  label="Notice Period (Days)"
                />
                <Tooltip
                  content="Number of days before lease expiry that tenant must provide notice if not renewing"
                  placement="top"
                >
                  <FormInput
                    id="noticePeriodDays"
                    name="renewalOptions.noticePeriodDays"
                    type="number"
                    onChange={handleOnChange}
                    placeholder="e.g., 60"
                    value={
                      leaseForm.values.renewalOptions?.noticePeriodDays?.toString() ||
                      ""
                    }
                    hasError={
                      !!leaseForm.errors["renewalOptions.noticePeriodDays"]
                    }
                    min="1"
                    max="365"
                  />
                </Tooltip>
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
                <Tooltip
                  content="Length of the renewal term in months"
                  placement="top"
                >
                  <FormInput
                    id="renewalTermMonths"
                    name="renewalOptions.renewalTermMonths"
                    type="number"
                    onChange={handleOnChange}
                    placeholder="e.g., 12"
                    value={
                      leaseForm.values.renewalOptions?.renewalTermMonths?.toString() ||
                      ""
                    }
                    hasError={
                      !!leaseForm.errors["renewalOptions.renewalTermMonths"]
                    }
                    min="1"
                    max="60"
                  />
                </Tooltip>
              </FormField>
            </div>
          </div>

          {/* Automation Settings */}
          <div className="mb-4">
            <h4 className="mb-2">Automation Settings</h4>
            <p className="muted mb-3">
              Configure when the system should automatically generate renewals
              and send signatures
            </p>
            <div className="form-fields">
              <FormField
                error={{
                  msg:
                    (leaseForm.errors[
                      "renewalOptions.daysBeforeExpiryToGenerateRenewal"
                    ] as string) || "",
                  touched: leaseForm.isTouched(
                    "renewalOptions.daysBeforeExpiryToGenerateRenewal"
                  ),
                }}
              >
                <FormLabel
                  htmlFor="daysBeforeExpiryToGenerateRenewal"
                  label="Days Before Expiry to Generate Renewal"
                />
                <Tooltip
                  content="Number of days before lease expiry to automatically generate a renewal draft"
                  placement="top"
                >
                  <FormInput
                    id="daysBeforeExpiryToGenerateRenewal"
                    name="renewalOptions.daysBeforeExpiryToGenerateRenewal"
                    type="number"
                    onChange={handleOnChange}
                    placeholder="e.g., 90"
                    value={
                      leaseForm.values.renewalOptions?.daysBeforeExpiryToGenerateRenewal?.toString() ||
                      ""
                    }
                    hasError={
                      !!leaseForm.errors[
                        "renewalOptions.daysBeforeExpiryToGenerateRenewal"
                      ]
                    }
                    min="1"
                    max="365"
                  />
                </Tooltip>
              </FormField>
              <FormField
                error={{
                  msg:
                    (leaseForm.errors[
                      "renewalOptions.daysBeforeExpiryToAutoSendSignature"
                    ] as string) || "",
                  touched: leaseForm.isTouched(
                    "renewalOptions.daysBeforeExpiryToAutoSendSignature"
                  ),
                }}
              >
                <FormLabel
                  htmlFor="daysBeforeExpiryToAutoSendSignature"
                  label="Days Before Expiry to Auto-Send Signature"
                />
                <Tooltip
                  content="Number of days before lease expiry to automatically send the renewal for signature"
                  placement="top"
                >
                  <FormInput
                    id="daysBeforeExpiryToAutoSendSignature"
                    name="renewalOptions.daysBeforeExpiryToAutoSendSignature"
                    type="number"
                    onChange={handleOnChange}
                    placeholder="e.g., 60"
                    value={
                      leaseForm.values.renewalOptions?.daysBeforeExpiryToAutoSendSignature?.toString() ||
                      ""
                    }
                    hasError={
                      !!leaseForm.errors[
                        "renewalOptions.daysBeforeExpiryToAutoSendSignature"
                      ]
                    }
                    min="1"
                    max="365"
                  />
                </Tooltip>
              </FormField>
            </div>
          </div>

          {/* Approval Settings */}
          <div className="mb-4">
            <h4 className="mb-2">Approval Settings</h4>
            <div className="toggle-container">
              <div className="toggle-label">
                <h4>Require Approval</h4>
                <p>
                  Require admin approval before automatic renewal processing can
                  proceed
                </p>
              </div>
              <Toggle
                id="requireApproval"
                name="renewalOptions.requireApproval"
                initialState={
                  leaseForm.values.renewalOptions?.requireApproval || false
                }
                onChange={(checked) =>
                  handleOnChange(checked, "renewalOptions.requireApproval")
                }
              />
            </div>
          </div>

          {/* Helper Information */}
          <div className="banner banner-warning">
            <div className="banner-content">
              <div className="banner-content__icon">
                <Icon name="bx-time" />
              </div>
              <div className="banner-content__info">
                <h4 className="mb-1">Automation Timeline</h4>
                <p className="mb-0">
                  The system will generate a renewal draft{" "}
                  <strong>
                    {leaseForm.values.renewalOptions
                      ?.daysBeforeExpiryToGenerateRenewal || "X"}{" "}
                    days
                  </strong>{" "}
                  before expiry and automatically send it for signature{" "}
                  <strong>
                    {leaseForm.values.renewalOptions
                      ?.daysBeforeExpiryToAutoSendSignature || "X"}{" "}
                    days
                  </strong>{" "}
                  before expiry.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
