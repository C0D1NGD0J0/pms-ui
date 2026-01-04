"use client";

import React from "react";
import { PageHeader } from "@components/PageElements";
import { Button, Form } from "@components/FormElements";
import { zodResolver } from "mantine-form-zod-resolver";
import { AccordionContainer } from "@components/Accordion";
import { UseFormReturnType, useForm } from "@mantine/form";
import { LeaseFormValues } from "@interfaces/lease.interface";
import { useFormChangeHandler } from "@hooks/useFormChangeHandler";
import { leaseRenewalSchema } from "@validations/lease.validations";
import {
  ScheduleRenewalModal,
  FinancialDetailsTab,
  RenewalSummaryCard,
  AdditionalTermsTab,
  LeaseTermsTab,
  CoTenantsTab,
} from "@leases/components";

interface LeaseRenewalViewProps {
  cuid: string;
  luid: string;
  renewalInitialValues: LeaseFormValues;
  isSubmitting: boolean;
  handleCreateRenewal: (data: LeaseFormValues) => void;
  handleCancel: () => void;
}

export function LeaseRenewalView({
  renewalInitialValues,
  isSubmitting,
  handleCreateRenewal,
  handleCancel,
}: LeaseRenewalViewProps) {
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [pendingFormData, setPendingFormData] =
    React.useState<LeaseFormValues | null>(null);

  const renewalForm: UseFormReturnType<
    LeaseFormValues,
    (values: LeaseFormValues) => LeaseFormValues
  > = useForm<LeaseFormValues>({
    initialValues: renewalInitialValues,
    validateInputOnBlur: true,
    validateInputOnChange: false,
    validate: zodResolver(leaseRenewalSchema),
  });

  const handleSubmit = renewalForm.onSubmit(
    (values) => {
      setPendingFormData(values);
      setShowScheduleModal(true);
    },
    (errors) => {
      console.error("Form validation failed", errors);
    }
  );

  const handleConfirmSchedule = () => {
    if (pendingFormData) {
      handleCreateRenewal(pendingFormData);
      setShowScheduleModal(false);
      setPendingFormData(null);
    }
  };

  const handleCancelSchedule = () => {
    setShowScheduleModal(false);
    setPendingFormData(null);
  };

  const {
    addCoTenant,
    handleCoTenantChange,
    handleOnChange,
    handleUtilityToggle,
    removeCoTenant,
  } = useFormChangeHandler(renewalForm);

  // Validation tracking for accordion checkmarks
  const isTabCompleted = React.useCallback(
    (tabId: string): boolean => {
      const values = renewalForm.values;

      switch (tabId) {
        case "lease-terms":
          return !!(
            values.type &&
            values.duration?.startDate &&
            values.duration?.endDate
          );

        case "financial-details":
          return !!(
            values.fees?.monthlyRent &&
            values.fees.monthlyRent > 0 &&
            values.fees?.securityDeposit !== undefined &&
            values.fees.securityDeposit >= 0
          );

        case "additional-terms":
        case "co-tenants":
          return true; // Optional sections

        default:
          return false;
      }
    },
    [renewalForm.values]
  );

  const accordionItems = React.useMemo(
    () => [
      {
        id: "lease-terms",
        label: "Lease Terms",
        isCompleted: isTabCompleted("lease-terms"),
        content: (
          <LeaseTermsTab
            leaseForm={renewalForm}
            handleOnChange={handleOnChange}
          />
        ),
      },
      {
        id: "financial-details",
        label: "Financial Details",
        isCompleted: isTabCompleted("financial-details"),
        content: (
          <FinancialDetailsTab
            leaseForm={renewalForm}
            handleOnChange={handleOnChange}
          />
        ),
      },
      {
        id: "additional-terms",
        label: "Additional Terms",
        isCompleted: isTabCompleted("additional-terms"),
        content: (
          <AdditionalTermsTab
            leaseForm={renewalForm}
            handleOnChange={handleOnChange}
            handleUtilityToggle={handleUtilityToggle}
          />
        ),
      },
      {
        id: "co-tenants",
        label: "Co-Tenants",
        isCompleted: isTabCompleted("co-tenants"),
        content: (
          <CoTenantsTab
            leaseForm={renewalForm}
            handleCoTenantChange={handleCoTenantChange}
            addCoTenant={addCoTenant}
            removeCoTenant={removeCoTenant}
          />
        ),
      },
    ],
    [
      isTabCompleted,
      renewalForm,
      handleOnChange,
      handleUtilityToggle,
      handleCoTenantChange,
      addCoTenant,
      removeCoTenant,
    ]
  );

  // Memoize props to prevent unnecessary re-renders of RenewalSummaryCard
  const renewalSummaryProps = React.useMemo(
    () => ({
      renewalLease: renewalForm.values as any,
      newRent: renewalForm.values.fees?.monthlyRent,
      newStartDate: renewalForm.values.duration?.startDate as string,
      newEndDate: renewalForm.values.duration?.endDate as string,
    }),
    [
      renewalForm.values.fees?.monthlyRent,
      renewalForm.values.duration?.startDate,
      renewalForm.values.duration?.endDate,
    ]
  );

  return (
    <div className="page-container">
      <div className="page add-lease">
        <PageHeader
          title={`Renew Lease: ${renewalInitialValues.leaseNumber}`}
          headerBtn={
            <Button
              label="Back"
              className="btn btn-outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              icon={<i className="bx bx-arrow-back"></i>}
            />
          }
        />

        <RenewalSummaryCard {...renewalSummaryProps} />

        <div className="resource-form">
          <Form
            id="lease-renewal-form"
            onSubmit={handleSubmit}
            disabled={isSubmitting}
          >
            <AccordionContainer
              items={accordionItems}
              showSidebar={true}
              defaultActiveId="lease-terms"
              ariaLabel="Lease renewal form sections"
              onChange={() => {}}
              showPreviewDrawer={false}
            />

            <div className="form-actions">
              <Button
                className="btn btn-outline"
                label="Cancel"
                icon={<i className="bx bx-x"></i>}
                onClick={handleCancel}
                disabled={isSubmitting}
              />
              <Button
                className="btn btn-primary"
                label={isSubmitting ? "Scheduling..." : "Schedule Renewal"}
                icon={
                  <i
                    className={
                      isSubmitting
                        ? "bx bx-loader-alt bx-spin"
                        : "bx bx-calendar-check"
                    }
                  ></i>
                }
                type="submit"
                disabled={isSubmitting}
              />
            </div>
          </Form>
        </div>
      </div>

      <ScheduleRenewalModal
        isOpen={showScheduleModal}
        onClose={handleCancelSchedule}
        onConfirm={handleConfirmSchedule}
        renewalLease={renewalInitialValues as any}
        newStartDate={renewalForm.values.duration?.startDate as string}
        newEndDate={renewalForm.values.duration?.endDate as string}
        isLoading={isSubmitting}
      />
    </div>
  );
}
