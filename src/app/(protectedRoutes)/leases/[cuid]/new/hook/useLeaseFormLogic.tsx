"use client";

import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useNotification } from "@hooks/useNotification";
import { LeaseFormValues } from "@interfaces/lease.interface";

import { useLeaseFormManagement } from "../../hooks";

interface UseLeaseFormLogicProps {
  params: Promise<{
    cuid: string;
  }>;
}

export function useLeaseFormLogic({ params }: UseLeaseFormLogicProps) {
  const { cuid } = React.use(params);
  const router = useRouter();
  const { client } = useAuth();
  const { openNotification } = useNotification();

  const formManagement = useLeaseFormManagement({
    cuid,
    mode: "create",
  });

  const [showCoTenantWarning, setShowCoTenantWarning] = useState(false);

  const createLeaseMutation = useMutation({
    mutationFn: (data: Partial<LeaseFormValues>) =>
      leaseService.createLease(client?.cuid || "", data),
    onSuccess: (result) => {
      if (result.data.success) {
        openNotification(
          "success",
          "Lease Created",
          "Lease has been created successfully!"
        );
        router.push(`/leases/${client?.cuid}`);
      } else {
        openNotification(
          "error",
          "Creation Failed",
          result.data.message || "Failed to create lease"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create lease. Please try again.";
      openNotification("error", "Creation Failed", errorMessage);
    },
  });

  const handleCreateSubmit = useCallback(async () => {
    if (!client?.cuid) {
      openNotification("error", "Error", "Client information not found");
      return;
    }

    const validation = formManagement.leaseForm.validate();
    if (validation.hasErrors) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix all form errors before submitting"
      );
      return;
    }

    try {
      const leaseData = {
        ...formManagement.leaseForm.values,
        cuid: client.cuid,
        duration: {
          ...formManagement.leaseForm.values.duration,
          startDate: formManagement.leaseForm.values.duration.startDate,
          endDate: formManagement.leaseForm.values.duration.endDate,
          ...(formManagement.leaseForm.values.duration.moveInDate && {
            moveInDate: formManagement.leaseForm.values.duration.moveInDate,
          }),
        },
        coTenants: formManagement.leaseForm.values.coTenants?.filter(
          (ct) => ct.name && ct.email && ct.phone
        ),
      };

      await createLeaseMutation.mutateAsync(leaseData);
    } catch (error) {
      console.error("Error creating lease:", error);
    }
  }, [client, formManagement.leaseForm, createLeaseMutation, openNotification]);

  const handleCreateLease = useCallback(() => {
    const hasCoTenants =
      formManagement.leaseForm.values.coTenants &&
      formManagement.leaseForm.values.coTenants.length > 0;

    if (!hasCoTenants) {
      setShowCoTenantWarning(true);
      return;
    }

    handleCreateSubmit();
  }, [formManagement.leaseForm.values.coTenants, handleCreateSubmit]);

  const handleConfirmWithoutCoTenants = useCallback(() => {
    setShowCoTenantWarning(false);
    handleCreateSubmit();
  }, [handleCreateSubmit]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return {
    cuid,
    leaseForm: formManagement.leaseForm,
    isSubmitting: createLeaseMutation.isPending,
    isFormValid: formManagement.isFormValid,
    accordionItems: formManagement.accordionItems,
    showCoTenantWarning,
    setShowCoTenantWarning,
    isDuplicating: formManagement.isDuplicating,
    duplicateSource: formManagement.duplicateSource,
    duplicateError: formManagement.duplicateError,
    handleCreateLease,
    handleConfirmWithoutCoTenants,
    handleCancel,
  };
}
