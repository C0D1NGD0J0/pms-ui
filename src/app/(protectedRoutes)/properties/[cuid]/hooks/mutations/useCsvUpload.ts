import { useForm } from "@mantine/form";
import { propertyService } from "@services/index";
import { useMutation } from "@tanstack/react-query";
import { csvUploadSchema } from "@validations/index";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useErrorHandler } from "@hooks/useErrorHandler";
import { useNotification } from "@hooks/useNotification";
import { zodResolver } from "mantine-form-zod-resolver";
import { CsvUploadValues } from "@interfaces/property.interface";

export interface ValidationResult {
  valid: boolean;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export interface ProcessingResult {
  success: boolean;
  processed: number;
  failed: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
}

export function useCsvUpload() {
  const { user } = useCurrentUser();
  const { openNotification } = useNotification();
  const { handleMutationError } = useErrorHandler();

  const csvValidationMutation = useMutation({
    mutationFn: (data: CsvUploadValues) =>
      propertyService.validatePropertiesCSV(data.cuid, data.csvFile!),
    // Global handler logs, we show custom notification
    onError: (error) => handleMutationError(error, "CSV validation failed"),
  });
  const importCsvMutation = useMutation({
    mutationFn: (data: CsvUploadValues) =>
      propertyService.addMultipleProperties(data.cuid, data.csvFile!),
    // Global handler logs, we show custom notification
    onError: (error) => handleMutationError(error, "Failed to import CSV"),
  });

  const form = useForm<CsvUploadValues>({
    initialValues: {
      csvFile: null,
      cuid: user?.client.cuid ?? (user?.client as any).id,
    },
    validateInputOnBlur: true,
    validate: zodResolver(csvUploadSchema),
  });

  const handleFileChange = (file: File | null) => {
    form.setFieldValue("csvFile", file);
  };

  const validateCSV = async () => {
    if (!form.values.csvFile) {
      openNotification("error", "Error", "Please select a CSV file first");
      return;
    }
    const resp = await csvValidationMutation.mutateAsync({
      cuid: form.values.cuid,
      csvFile: form.values.csvFile,
    });
    if (resp.success) {
      form.setFieldValue("csvFile", form.values.csvFile);
    }
    return resp;
  };

  const processCSV = async () => {
    if (!form.values.csvFile) {
      openNotification("error", "Error", "Please validate the CSV file first");
      return;
    }

    const resp = await importCsvMutation.mutateAsync({
      cuid: form.values.cuid,
      csvFile: form.values.csvFile,
    });
    return resp;
  };

  const resetState = () => {
    form.reset();
  };

  return {
    csvFile: form.values.csvFile,
    isProcessing: importCsvMutation.isPending,
    isValidating: csvValidationMutation.isPending,
    handleFileChange,
    validateCSV,
    processCSV,
    resetState,
  };
}
