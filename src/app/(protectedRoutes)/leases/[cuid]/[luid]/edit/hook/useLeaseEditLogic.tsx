"use client";

import { useAuth } from "@store/index";
import { useRouter } from "next/navigation";
import { leaseService } from "@services/lease";
import { extractChanges } from "@utils/helpers";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { useNotification } from "@hooks/useNotification";
import { LeaseFormValues } from "@interfaces/lease.interface";

import { useLeaseFormManagement } from "../../../hooks";

interface UseLeaseEditLogicProps {
  params: Promise<{
    cuid: string;
    luid: string;
  }>;
}

export function useLeaseEditLogic({ params }: UseLeaseEditLogicProps) {
  const { cuid, luid } = React.use(params);
  const router = useRouter();
  const { client } = useAuth();
  const { openNotification } = useNotification();

  const formManagement = useLeaseFormManagement({
    cuid,
    mode: "edit",
    luid,
  });

  const [showCoTenantWarning, setShowCoTenantWarning] = useState(false);
  const [showPropertyChangeWarning, setShowPropertyChangeWarning] =
    useState(false);

  const updateLeaseMutation = useMutation({
    mutationFn: ({
      cuid,
      luid,
      data,
    }: {
      cuid: string;
      luid: string;
      data: Partial<LeaseFormValues>;
    }) => leaseService.updateLease(cuid, luid, data),
    onSuccess: (result) => {
      if (result.success) {
        openNotification(
          "success",
          "Lease Updated",
          "Lease has been updated successfully!"
        );
        router.push(`/leases/${client?.cuid}`);
      } else {
        openNotification(
          "error",
          "Update Failed",
          result.message || "Failed to update lease"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update lease. Please try again.";
      openNotification("error", "Update Failed", errorMessage);
    },
  });

  const signatureRequestMutation = useMutation({
    mutationFn: ({
      cuid,
      luid,
      action,
    }: {
      cuid: string;
      luid: string;
      action: "send" | "resend" | "cancel";
    }) => leaseService.signatureRequest(cuid, luid, action),
    onSuccess: (result) => {
      if (result.data?.success) {
        openNotification(
          "success",
          "Signature Request Sent",
          "Lease document has been sent for signature!"
        );
      } else {
        openNotification(
          "error",
          "Signature Request Failed",
          result.data?.message || "Failed to send signature request"
        );
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send signature request. Please try again.";
      openNotification("error", "Signature Request Failed", errorMessage);
    },
  });

  const handleUpdateSubmit = useCallback(async () => {
    if (!formManagement.originalValues) {
      console.warn("Original values not available for comparison");
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
      const changedValues: Partial<LeaseFormValues> | null = extractChanges(
        formManagement.originalValues,
        formManagement.leaseForm.values,
        {
          ignoreKeys: [
            "cuid",
            "tenantInfo",
            "luid",
            "leaseNumber",
            "createdAt",
            "createdBy",
          ],
        }
      );

      if (changedValues && Object.keys(changedValues).length > 0) {
        await updateLeaseMutation.mutateAsync({
          cuid,
          luid,
          data: changedValues,
        });
      } else {
        openNotification("info", "No Changes", "No changes detected to update");
      }
    } catch (error) {
      console.error("Error updating lease:", error);
    }
  }, [
    cuid,
    luid,
    formManagement.leaseForm,
    formManagement.originalValues,
    updateLeaseMutation,
    openNotification,
    router,
  ]);

  const handleUpdateLease = useCallback(() => {
    // Check if property address changed
    const propertyAddressChanged =
      formManagement.originalValues?.property?.address !==
      formManagement.leaseForm.values.property.address;

    if (propertyAddressChanged) {
      setShowPropertyChangeWarning(true);
      return;
    }

    // Check co-tenants
    const hasCoTenants =
      formManagement.leaseForm.values.coTenants &&
      formManagement.leaseForm.values.coTenants.length > 0;

    if (!hasCoTenants) {
      setShowCoTenantWarning(true);
      return;
    }

    handleUpdateSubmit();
  }, [
    formManagement.leaseForm.values.coTenants,
    formManagement.leaseForm.values.property.address,
    formManagement.originalValues?.property?.address,
    handleUpdateSubmit,
  ]);

  const handleSignatureRequest = useCallback(
    async (action: "send" | "resend" | "cancel") => {
      signatureRequestMutation.mutateAsync({ cuid, luid, action });
    },
    [cuid, luid, signatureRequestMutation]
  );

  const handleConfirmPropertyChange = useCallback(() => {
    setShowPropertyChangeWarning(false);

    // After confirming property change, check co-tenants
    const hasCoTenants =
      formManagement.leaseForm.values.coTenants &&
      formManagement.leaseForm.values.coTenants.length > 0;

    if (!hasCoTenants) {
      setShowCoTenantWarning(true);
      return;
    }

    handleUpdateSubmit();
  }, [formManagement.leaseForm.values.coTenants, handleUpdateSubmit]);

  const handleConfirmWithoutCoTenants = useCallback(() => {
    setShowCoTenantWarning(false);
    handleUpdateSubmit();
  }, [handleUpdateSubmit]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return {
    cuid,
    luid,
    leaseForm: formManagement.leaseForm,
    isSubmitting: updateLeaseMutation.isPending,
    html: formManagement.html,
    isLoadingPreview: formManagement.isLoadingPreview,
    isFormValid: formManagement.isFormValid,
    accordionItems: formManagement.accordionItems,
    showCoTenantWarning,
    setShowCoTenantWarning,
    showPropertyChangeWarning,
    setShowPropertyChangeWarning,
    isEditing: formManagement.isEditing,
    editLuid: formManagement.editLuid || null,
    isLoadingEdit: formManagement.isLoadingEdit,
    editError: formManagement.editError,
    hasUnsavedChanges: formManagement.hasUnsavedChanges,
    handleUpdateLease,
    handleConfirmPropertyChange,
    handleConfirmWithoutCoTenants,
    handlePreviewClick: formManagement.handlePreviewClick,
    handleCancel,
    clearPreview: formManagement.clearPreview,

    requestSignatures: handleSignatureRequest,
    signatureRequestError: signatureRequestMutation.error,
    isSignatureRequestLoading: signatureRequestMutation.isPending,
  };
}
