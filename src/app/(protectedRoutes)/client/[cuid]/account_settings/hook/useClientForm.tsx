"use client";

import { useForm } from "@mantine/form";
import { parseError } from "@utils/helpers";
import { CLIENT_QUERY_KEYS } from "@src/utils";
import { clientService } from "@services/client";
import { IClient } from "@interfaces/client.interface";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
import { useCallback, useEffect, useState, useRef } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
    revertChanges,
    getFieldStatus,
    triggerAutoSave,
    triggerManualSave,
    hasUnsavedChanges,
    isAutoSaving: autoSaveMutation.isPending,
    isManuallySaving: manualSaveMutation.isPending,
  };
};
