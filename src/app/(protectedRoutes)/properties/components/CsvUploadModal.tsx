"use client";
import React, { useState } from "react";
import { Button } from "@components/FormElements";
import { Modal } from "@components/FormElements/Modal";
import { useNotification } from "@hooks/useNotification";
import { useCsvUpload } from "@properties/hooks/useCsvUpload";

interface CSVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CsvUploadModal({ isOpen, onClose }: CSVUploadModalProps) {
  const {
    csvFile,
    isValidating,
    isProcessing,
    handleFileChange,
    validateCSV,
    processCSV,
    resetState,
  } = useCsvUpload();
  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    data: { processId: string };
    message: string;
  } | null>(null);
  const { openNotification } = useNotification();

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCsvImport = async () => {
    try {
      const resp = validationResult ? await processCSV() : await validateCSV();
      openNotification(
        "success",
        "Csv validation",
        resp.message || "CSV validation process started."
      );
      setValidationResult(resp);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An error occurred during validation";
      openNotification("error", "Processing Error", errorMessage);
    }
  };

  // const renderProcessingResults = () => {
  //   if (!processingResult) return null;

  //   return (
  //     <div className="processing-results">
  //       <div
  //         className={`result-icon ${
  //           processingResult.success ? "success" : "error"
  //         }`}
  //       >
  //         <i
  //           className={`bx ${processingResult.success ? "bx-check" : "bx-x"}`}
  //         ></i>
  //       </div>

  //       <h3>
  //         {processingResult.success
  //           ? "Import Completed Successfully"
  //           : "Import Failed"}
  //       </h3>

  //       <div className="result-stats">
  //         <div className="stat-item">
  //           <span className="stat-label">Processed:</span>
  //           <span className="stat-value">{processingResult.processed}</span>
  //         </div>
  //         {processingResult.failed > 0 && (
  //           <div className="stat-item error">
  //             <span className="stat-label">Failed:</span>
  //             <span className="stat-value">{processingResult.failed}</span>
  //           </div>
  //         )}
  //       </div>

  //       {processingResult.errors && processingResult.errors.length > 0 && (
  //         <div className="processing-errors">
  //           <h4>Errors:</h4>
  //           <ul className="error-list">
  //             {processingResult.errors.map((error, index) => (
  //               <li key={index} className="error-item">
  //                 <span className="error-row">Row {error.row}:</span>{" "}
  //                 {error.message}
  //               </li>
  //             ))}
  //           </ul>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const renderModalContent = () => {
    // if (processingResult) {
    //   return (
    //     <>
    //       {renderProcessingResults()}
    //       <p className="action-hint">
    //         You can now close this window or upload another file.
    //       </p>
    //     </>
    //   );
    // }

    if (isValidating) {
      return (
        <div className="validating-indicator">
          <i className="bx bx-loader-alt bx-spin"></i>
          <p>Validating CSV file...</p>
        </div>
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
    return (
      <>
        <Button label="Cancel" onClick={handleClose} className="btn-default" />
        <Button
          className="btn-primary"
          onClick={handleCsvImport}
          disabled={isProcessing || isValidating || !csvFile}
          label={validationResult ? "Start Import" : "Validate CSV"}
        />
      </>
    );
  };

  const getModalTitle = () => {
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
