import { useForm } from "@mantine/form";
import { propertyService } from "@services/index";
import { useMutation } from "@tanstack/react-query";
import { csvUploadSchema } from "@validations/index";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@hooks/useNotification";
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

  const csvValidationMutation = useMutation({
    mutationFn: (data: CsvUploadValues) =>
      propertyService.validatePropertiesCSV(data.cid, data.csvFile!),
  });
  const importCsvMutation = useMutation({
    mutationFn: (data: CsvUploadValues) =>
      propertyService.addMultipleProperties(data.cid, data.csvFile!),
  });

  const form = useForm<CsvUploadValues>({
    initialValues: {
      csvFile: null,
      cid: user?.client.csub ?? (user?.client as any).id,
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
      cid: form.values.cid,
      csvFile: form.values.csvFile,
    });
    return resp;
  };

  const processCSV = async () => {
    if (!form.values.csvFile) {
      openNotification("error", "Error", "Please validate the CSV file first");
      return;
    }

    const resp = await importCsvMutation.mutateAsync({
      cid: form.values.cid,
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
