"use client";

import { useForm } from "@mantine/form";
import { parseError } from "@utils/helpers";
import { CLIENT_QUERY_KEYS } from "@src/utils";
import { clientService } from "@services/client";
import { IClient } from "@interfaces/client.interface";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import {
  UpdateClientDetailsFormData,
  updateClientDetailsSchema,
} from "@validations/client.validations";

interface UseClientFormProps {
  clientData: IClient;
  cuid: string;
}

export const useClientForm = ({ clientData, cuid }: UseClientFormProps) => {
  const { openNotification } = useNotification();
  const queryClient = useQueryClient();
  const [lastManualSave, setLastManualSave] = useState<Date | null>(null);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const lastSavedValues = useRef<UpdateClientDetailsFormData | null>(null);

  const form = useForm<UpdateClientDetailsFormData>({
    validate: zodResolver(updateClientDetailsSchema),
    initialValues: {
      displayName: clientData.displayName || "",
      identification: clientData.identification,
      companyProfile: clientData.companyProfile,
      settings: clientData.settings,
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
  });

  useEffect(() => {
    if (clientData.displayName) {
      form.setFieldValue("displayName", clientData.displayName);
    }
  }, [clientData.displayName]);
  const hasUnsavedChanges = form.isDirty();

  const autoSaveMutation = useMutation({
    mutationFn: (data: UpdateClientDetailsFormData) =>
      clientService.updateClient(cuid, data),
    onSuccess: (data, variables) => {
      setLastAutoSave(new Date());
      lastSavedValues.current = variables;
      form.resetDirty();
      openNotification("success", "Auto-saved", "Changes saved automatically");
      queryClient.invalidateQueries({
        queryKey: CLIENT_QUERY_KEYS.getClientBycuid(cuid),
      });
    },
    onError: (error: any) => {
      const { message } = parseError(error);
      console.error("Auto-save failed:", error);
      openNotification("error", "Auto-save failed", message);
    },
  });

  const manualSaveMutation = useMutation({
    mutationFn: (data: UpdateClientDetailsFormData) =>
      clientService.updateClient(cuid, data),
    onSuccess: (data, variables) => {
      setLastManualSave(new Date());
      setLastAutoSave(null);
      lastSavedValues.current = variables;

      form.resetDirty();
      openNotification(
        "success",
        "Saved Successfully",
        "All changes have been saved"
      );

      queryClient.invalidateQueries({
        queryKey: CLIENT_QUERY_KEYS.getClientBycuid(cuid),
      });
    },
    onError: (error: any) => {
      const { message, fieldErrors } = parseError(error);

      if (Object.keys(fieldErrors).length > 0) {
        const formattedErrors: Record<string, string> = {};
        Object.entries(fieldErrors).forEach(([field, errors]) => {
          formattedErrors[field] = (errors as any)[0];
        });
        form.setErrors(formattedErrors);
      }

      openNotification("error", "Save Failed", message);
    },
  });

  const triggerAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges) return Promise.resolve();

    const validationResult = form.validate();
    if (validationResult.hasErrors) {
      throw new Error("Please fix validation errors before switching tabs");
    }

    return autoSaveMutation.mutateAsync(form.values);
  }, [hasUnsavedChanges, form, autoSaveMutation]);

  const triggerManualSave = useCallback(async () => {
    if (!hasUnsavedChanges) {
      openNotification("info", "No Changes", "No changes to save");
      return;
    }

    const validationResult = form.validate();
    if (validationResult.hasErrors) {
      openNotification(
        "error",
        "Validation Error",
        "Please fix the errors before saving"
      );
      return;
    }

    return manualSaveMutation.mutateAsync(form.values);
  }, [hasUnsavedChanges, form, manualSaveMutation, openNotification]);

  const revertChanges = useCallback(() => {
    form.setValues({
      displayName: clientData.displayName || "",
      identification: clientData.identification,
      companyProfile: clientData.companyProfile,
      settings: clientData.settings,
    });
    form.resetDirty();
    form.clearErrors();
    openNotification(
      "info",
      "Changes Reverted",
      "All unsaved changes have been discarded"
    );
  }, [form, clientData, openNotification]);

  const getFieldStatus = useCallback(
    (fieldName: string) => {
      const isDirty = form.isDirty(fieldName);

      if (isDirty) return "pending";
      return "saved";
    },
    [form]
  );

  // Define which fields belong to which tab
  const tabFields = useMemo(
    () => ({
      profile: ["displayName"],
      identification: [
        "identification.taxId",
        "identification.ssn",
        "identification.businessLicenseNumber",
        "identification.vatNumber",
      ],
      company: [
        "companyProfile.name",
        "companyProfile.industry",
        "companyProfile.size",
        "companyProfile.website",
        "companyProfile.registrationNumber",
        "companyProfile.description",
      ],
      preferences: [
        "settings.language",
        "settings.timezone",
        "settings.currency",
        "settings.dateFormat",
        "settings.notifications.email",
        "settings.notifications.sms",
        "settings.notifications.push",
      ],
    }),
    []
  );

  // Check if a specific tab has validation errors
  const hasTabErrors = useCallback(
    (tabId: string): boolean => {
      const relevantFields = tabFields[tabId as keyof typeof tabFields] || [];

      return relevantFields.some((field) => {
        // Check if field has errors in form.errors
        if (form.errors[field as keyof typeof form.errors]) {
          return true;
        }

        // Handle nested field paths (e.g., "identification.taxId")
        if (field.includes(".")) {
          const parts = field.split(".");
          let errorObj: any = form.errors;

          for (const part of parts) {
            if (!errorObj || typeof errorObj !== "object") return false;
            errorObj = errorObj[part];
            if (errorObj && typeof errorObj === "string") return true;
          }
        }

        return false;
      });
    },
    [form.errors, tabFields]
  );

  const saveStatus = {
    hasUnsavedChanges,
    isAutoSaving: autoSaveMutation.isPending,
    isManuallySaving: manualSaveMutation.isPending,
    lastAutoSave,
    lastManualSave,
  };

  return {
    form,
    saveStatus,
    hasTabErrors,
    revertChanges,
    getFieldStatus,
    triggerAutoSave,
    triggerManualSave,
    hasUnsavedChanges,
    isAutoSaving: autoSaveMutation.isPending,
    isManuallySaving: manualSaveMutation.isPending,
  };
};
