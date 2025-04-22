"use client";
import React from "react";
import { Button } from "@components/FormElements";
import { Modal } from "@components/FormElements/Modal";

import { FileInput } from "./FileInput";
import { ValidationResult, useCsvUpload } from "../hooks/useCsvUpload";

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CsvUploadModal({ isOpen, onClose }: CSVUploadModalProps) {
  const {
    csvFile,
    isValidating,
    isProcessing,
    validationResult,
    processingResult,
    handleFileChange,
    validateCSV,
    processCSV,
    resetState,
  } = useCsvUpload();

  const handleClose = () => {
    resetState();
    onClose();
  };

  const renderValidationResults = (results: ValidationResult) => {
    return (
      <div className="validation-results">
        <div className="validation-summary">
          <h3>Validation Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Rows:</span>
              <span className="stat-value">{results.totalRows}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Valid Rows:</span>
              <span className="stat-value">{results.validRows}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Invalid Rows:</span>
              <span className="stat-value">{results.invalidRows}</span>
            </div>
          </div>
        </div>

        {results.errors.length > 0 && (
          <div className="validation-errors">
            <h4>Errors Found:</h4>
            <ul className="error-list">
              {results.errors.map((error, index) => (
                <li key={index} className="error-item">
                  <span className="error-row">Row {error.row}:</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderProcessingResults = () => {
    if (!processingResult) return null;

    return (
      <div className="processing-results">
        <div
          className={`result-icon ${
            processingResult.success ? "success" : "error"
          }`}
        >
          <i
            className={`bx ${processingResult.success ? "bx-check" : "bx-x"}`}
          ></i>
        </div>

        <h3>
          {processingResult.success
            ? "Import Completed Successfully"
            : "Import Failed"}
        </h3>

        <div className="result-stats">
          <div className="stat-item">
            <span className="stat-label">Processed:</span>
            <span className="stat-value">{processingResult.processed}</span>
          </div>
          {processingResult.failed > 0 && (
            <div className="stat-item error">
              <span className="stat-label">Failed:</span>
              <span className="stat-value">{processingResult.failed}</span>
            </div>
          )}
        </div>

        {processingResult.errors && processingResult.errors.length > 0 && (
          <div className="processing-errors">
            <h4>Errors:</h4>
            <ul className="error-list">
              {processingResult.errors.map((error, index) => (
                <li key={index} className="error-item">
                  <span className="error-row">Row {error.row}:</span>{" "}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderModalContent = () => {
    if (processingResult) {
      return (
        <>
          {renderProcessingResults()}
          <p className="action-hint">
            You can now close this window or upload another file.
          </p>
        </>
      );
    }

    if (isValidating || validationResult) {
      return (
        <>
          {isValidating ? (
            <div className="validating-indicator">
              <i className="bx bx-loader-alt bx-spin"></i>
              <p>Validating CSV file...</p>
            </div>
          ) : (
            validationResult && renderValidationResults(validationResult)
          )}
        </>
      );
    }

    return (
      <>
        <p className="modal-description">
          Upload a CSV file containing property information. The file should
          include the following columns: name, address, property_type, status,
          etc.
        </p>

        <div className="csv-uploader">
          <FileInput
            accept=".csv"
            onChange={handleFileChange}
            instructionText="Please use our CSV template to ensure proper formatting"
          />
        </div>

        <div className="csv-template">
          <p>
            <i className="bx bx-download"></i>
            <a href="/templates/property-import.csv" download>
              Download CSV Template
            </a>
          </p>
        </div>
      </>
    );
  };

  const renderFooterActions = () => {
    if (processingResult) {
      return (
        <>
          <Button
            label="Upload Another"
            onClick={resetState}
            className="btn-default"
          />
          <Button label="Close" onClick={handleClose} className="btn-primary" />
        </>
      );
    }

    if (validationResult) {
      return (
        <>
          <Button
            label="Cancel"
            onClick={handleClose}
            className="btn-default"
          />
          <Button
            label="Start Import"
            onClick={processCSV}
            className="btn-primary"
            disabled={isProcessing || !validationResult.valid}
          />
        </>
      );
    }

    return (
      <>
        <Button label="Cancel" onClick={handleClose} className="btn-default" />
        <Button
          label="Validate CSV"
          onClick={validateCSV}
          className="btn-primary"
          disabled={isValidating || !csvFile}
        />
      </>
    );
  };

  const getModalTitle = () => {
    if (processingResult) {
      return "Import Results";
    }
    if (validationResult) {
      return "CSV Validation Results";
    }
    return "Upload Properties via CSV";
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <Modal.Header title={getModalTitle()} onClose={handleClose} />
      <Modal.Content>{renderModalContent()}</Modal.Content>
      <Modal.Footer>{renderFooterActions()}</Modal.Footer>
    </Modal>
  );
}
