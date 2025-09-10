"use client";
import React, { useState } from "react";
import { Modal } from "@components/FormElements/Modal";
import { useNotification } from "@hooks/useNotification";
import { FileInput, Button } from "@components/FormElements";
import {
  CsvValidationResult,
  CsvUploadConfig,
} from "@interfaces/csv.interface";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CsvUploadConfig;
  onPreviewData?: (data: any[]) => void;
}

export function CsvUploadModal({
  isOpen,
  onClose,
  config,
  onPreviewData,
}: CsvUploadModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] =
    useState<CsvValidationResult | null>(null);
  const { message } = useNotification();

  const handleFileChange = (file: File | null) => {
    setCsvFile(file);
    setValidationResult(null);
  };

  const resetState = () => {
    setCsvFile(null);
    setValidationResult(null);
    setIsValidating(false);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const validateCSV = async () => {
    if (!csvFile) return;

    setIsValidating(true);
    try {
      const result = await config.serviceMethods.validateCsv(csvFile);
      setValidationResult(result);

      // If we have preview data and it's enabled, call the preview callback
      if (config.showPreview && result.data?.validData && onPreviewData) {
        onPreviewData(result.data.validData);
      }

      message.success(
        `CSV Validation Complete: ${
          result.data?.validRecords || 0
        } valid records found. ${
          (result.data?.invalidRecords || 0) > 0
            ? `${result?.data?.invalidRecords} records have errors.`
            : "All records are valid!"
        }`
      );
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred during validation";
      message.error(`Validation Error: ${errorMessage}`);
    } finally {
      setIsValidating(false);
    }
  };

  const processCSV = async () => {
    if (!validationResult?.data?.processId) return;

    setIsProcessing(true);
    try {
      const result = await config.serviceMethods.processCsv(
        validationResult.data.processId
      );

      message.success(
        `Processing Completed Successfully: ${result.data.processed} records have been processed successfully.`
      );

      handleClose();
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An error occurred during processing";
      message.error(`Processing Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCsvImport = async () => {
    if (validationResult) {
      await processCSV();
    } else {
      await validateCSV();
    }
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <div className="validation-results">
        <div
          className={`result-icon ${
            validationResult.success ? "success" : "error"
          }`}
        >
          <i
            className={`bx ${
              validationResult.success ? "bx-check-circle" : "bx-error-circle"
            }`}
          ></i>
        </div>

        <h3>
          {validationResult.success
            ? "Validation Completed"
            : "Validation Found Issues"}
        </h3>

        {validationResult.data && (
          <div className="result-stats">
            <div className="stat-item success">
              <span className="stat-label">Valid Records:</span>
              <span className="stat-value">
                {validationResult.data.validRecords}
              </span>
            </div>
            {validationResult.data.invalidRecords > 0 && (
              <div className="stat-item error">
                <span className="stat-label">Invalid Records:</span>
                <span className="stat-value">
                  {validationResult.data.invalidRecords}
                </span>
              </div>
            )}
          </div>
        )}

        {validationResult.errors && validationResult.errors.length > 0 && (
          <div className="validation-errors">
            <h4>Errors Found:</h4>
            <ul className="error-list">
              {validationResult.errors.slice(0, 10).map((error, index) => (
                <li key={index} className="error-item">
                  <span className="error-row">Row {error.row}:</span>{" "}
                  {error.message}
                </li>
              ))}
              {validationResult.errors.length > 10 && (
                <li className="error-item">
                  ... and {validationResult.errors.length - 10} more errors
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderModalContent = () => {
    if (validationResult) {
      return (
        <>
          {renderValidationResults()}
          {validationResult.success &&
            validationResult.data &&
            validationResult.data.validRecords > 0 && (
              <p className="action-hint">
                {config.showPreview
                  ? "Review the preview data below, then click 'Confirm & Process' to proceed."
                  : "Click 'Start Processing' to proceed with all valid records."}
              </p>
            )}
        </>
      );
    }

    if (isValidating) {
      return (
        <div className="validating-indicator">
          <i className="bx bx-loader-alt bx-spin"></i>
          <p>Validating CSV file...</p>
        </div>
      );
    }

    if (isProcessing) {
      return (
        <div className="processing-indicator">
          <i className="bx bx-loader-alt bx-spin"></i>
          <p>Processing records...</p>
        </div>
      );
    }

    return (
      <>
        <p className="modal-description">{config.description}</p>

        <div className="csv-uploader">
          <FileInput
            accept=".csv"
            onChange={(file) =>
              handleFileChange(Array.isArray(file) ? file[0] : file)
            }
            instructionText="Please use our CSV template to ensure proper formatting"
          />
        </div>

        <div className="csv-template">
          <p>
            <i className="bx bx-download"></i>
            <a href={config.templateUrl} download>
              {config.templateName}
            </a>
          </p>
        </div>

        <div className="csv-format-info">
          <h4>Required CSV Format:</h4>
          <ul>
            {config.columns.map((column, index) => (
              <li key={index}>
                <strong>{column.name}:</strong> {column.description}
                {column.required && " (required)"}
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  };

  const renderFooterActions = () => {
    if (isValidating || isProcessing) {
      return (
        <Button label="Cancel" onClick={handleClose} className="btn-default" />
      );
    }

    return (
      <>
        <Button label="Cancel" onClick={handleClose} className="btn-default" />
        <Button
          className="btn-primary"
          onClick={handleCsvImport}
          disabled={
            !csvFile ||
            (validationResult &&
              (!validationResult.success ||
                (validationResult.data?.validRecords || 0) === 0)) ||
            false
          }
          label={
            validationResult
              ? config.showPreview
                ? "Confirm & Process"
                : "Start Processing"
              : "Validate CSV"
          }
        />
      </>
    );
  };

  const getModalTitle = () => {
    if (isProcessing) {
      return "Processing Records";
    }
    if (validationResult) {
      return "CSV Validation Results";
    }
    return config.title;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <Modal.Header title={getModalTitle()} onClose={handleClose} />
      <Modal.Content>{renderModalContent()}</Modal.Content>
      <Modal.Footer>{renderFooterActions()}</Modal.Footer>
    </Modal>
  );
}
