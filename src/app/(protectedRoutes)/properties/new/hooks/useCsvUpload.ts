import { useState } from "react";
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
  const [csvFile, setCSVFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [processingResult, setProcessingResult] =
    useState<ProcessingResult | null>(null);
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
      cid: user?.client.csub ?? "",
    },
    validateInputOnBlur: true,
    validate: zodResolver(csvUploadSchema),
  });

  const handleFileChange = (file: File | null) => {
    form.setFieldValue("csvFile", file);
    setValidationResult(null);
    setProcessingResult(null);
  };

  const validateCSV = async () => {
    if (!csvFile) {
      openNotification("error", "Error", "Please select a CSV file first");
      return;
    }

    try {
      setIsValidating(true);
      const resp = await csvValidationMutation.mutateAsync({
        cid: form.values.cid,
        csvFile: form.values.csvFile,
      });
      console.log(resp, "----resp----");
      setValidationResult(resp);

      if (resp.valid) {
        openNotification(
          "success",
          "Validation Successful",
          `${resp.validRows} of ${resp.totalRows} rows are valid`
        );
      } else {
        openNotification(
          "error",
          "Validation Failed",
          `Found ${resp.errors.length} errors in your CSV file`
        );
      }
    } catch (error) {
      console.error("Error validating CSV:", error);
      openNotification(
        "error",
        "Validation Error",
        "An error occurred during validation"
      );
    } finally {
      setIsValidating(false);
    }
  };

  const processCSV = async () => {
    if (!csvFile || !validationResult) {
      openNotification("error", "Error", "Please validate the CSV file first");
      return;
    }

    try {
      setIsProcessing(true);
      const resp = await importCsvMutation.mutateAsync({
        cid: form.values.cid,
        csvFile: form.values.csvFile,
      });
      console.log(resp, "======rESP=====");
      setProcessingResult(resp);

      openNotification(
        "success",
        "Import Successful",
        `Successfully imported ${resp.processed} properties`
      );
    } catch (error: any) {
      console.error("Error processing CSV:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred during import";
      openNotification("error", "Processing Error", errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setCSVFile(null);
    form.reset();
    setValidationResult(null);
    setProcessingResult(null);
  };

  return {
    form,
    csvFile,
    isValidating,
    isProcessing,
    validationResult,
    processingResult,
    handleFileChange,
    validateCSV,
    processCSV,
    resetState,
  };
}
