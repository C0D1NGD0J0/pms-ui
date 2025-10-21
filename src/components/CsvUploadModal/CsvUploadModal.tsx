"use client";
import React, { useState } from "react";
import { Modal } from "@components/FormElements/Modal";
import { useNotification } from "@hooks/useNotification";
import { CsvUploadConfig } from "@interfaces/csv.interface";
import { FileInput, Button } from "@components/FormElements";

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CsvUploadConfig;
}

export function CsvUploadModal({
  isOpen,
  onClose,
  config,
}: CsvUploadModalProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { message, confirm } = useNotification();

  const handleFileChange = (file: File | null) => {
    setCsvFile(file);
  };

  const handleClose = () => {
    setCsvFile(null);
    onClose();
  };

  const handleValidate = async () => {
    if (!csvFile) return;

    setIsValidating(true);
    try {
      await config.serviceMethods.validateCsv(csvFile);

      message.info(
        "Validating CSV... Check notifications for results when complete."
      );

      handleClose();
    } catch (error) {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        (error as Error).message ||
        "Failed to start CSV validation";
      message.error(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDirectImport = async () => {
    if (!csvFile) return;

    confirm({
      title: "Import without validation?",
      message:
        "Skipping validation means invalid records will be reported as errors after import. Validation is recommended for large files.",
      type: "warning",
      confirmText: "Yes, Import Now",
      cancelText: "Cancel",
      onConfirm: async () => {
        setIsImporting(true);
        try {
          await config.serviceMethods.importCsv(csvFile);

          message.info(
            "Importing CSV... Check notifications for results when complete."
          );

          handleClose();
        } catch (error) {
          const errorMessage =
            (error as any)?.response?.data?.message ||
            (error as Error).message ||
            "Failed to start CSV import";
          message.error(errorMessage);
        } finally {
          setIsImporting(false);
        }
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <Modal.Header title={config.title} onClose={handleClose} />

      <Modal.Content>
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
      </Modal.Content>

      <Modal.Footer>
        <Button label="Cancel" onClick={handleClose} className="btn-default" />
        <Button
          label={isValidating ? "Validating..." : "Validate First"}
          onClick={handleValidate}
          disabled={!csvFile || isValidating || isImporting}
          className="btn-outline"
        />
        <Button
          label={isImporting ? "Importing..." : "Import Directly"}
          onClick={handleDirectImport}
          disabled={!csvFile || isValidating || isImporting}
          className="btn-primary"
        />
      </Modal.Footer>
    </Modal>
  );
}
