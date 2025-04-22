"use client";
import React, { useState, useRef } from "react";
import {
  FormInput,
  FormLabel,
  FormField,
  Button,
} from "@components/FormElements";

export interface FileItem {
  fileName: string;
  fileSize: number;
  file?: File | null;
  url?: string;
  isExternal?: boolean;
  documentType?: string;
  description?: string;
  externalUrl?: string;
}

interface FileUploaderProps {
  fileType: "document" | "image";
  onFileAdded: (file: FileItem) => void;
  acceptedFileTypes: string;
  uploadInstructions?: string;
  documentTypeField?: React.ReactNode;
  descriptionField?: React.ReactNode;
}

export function FileUploader({
  fileType,
  onFileAdded,
  acceptedFileTypes,
  uploadInstructions,
  documentTypeField,
  descriptionField,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputMethod, setInputMethod] = useState<"file" | "url" | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [tempFile, setTempFile] = useState<File | null>(null);

  const handleBrowseFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];

      if (fileType === "image") {
        onFileAdded({
          fileName: newFile.name,
          fileSize: newFile.size,
          file: newFile,
        });

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setTempFile(newFile);
      }
    }
  };

  const handleUrlAdd = () => {
    if (!externalUrl) {
      alert(`Please enter a ${fileType} URL`);
      return;
    }

    onFileAdded({
      fileName: externalUrl.split("/").pop() || "external-file",
      fileSize: 0,
      url: externalUrl,
      isExternal: true,
      externalUrl: fileType === "document" ? externalUrl : undefined,
    });

    setExternalUrl("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <>
      <div className="input-method-toggle">
        <div className="form-toggle">
          <Button
            label="Upload Files"
            onClick={() => {
              setInputMethod("file");
              setExternalUrl("");
            }}
            className={`btn-default ${inputMethod === "file" ? "active" : ""}`}
            icon={<i className="bx bx-upload"></i>}
          />
          <Button
            label="Use URL"
            onClick={() => {
              setInputMethod("url");
              setTempFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className={`btn-default ${inputMethod === "url" ? "active" : ""}`}
            icon={<i className="bx bx-link"></i>}
          />
        </div>
        <small className="form-help-text">
          Choose how you want to add your {fileType}
        </small>
      </div>

      {fileType === "document" && (
        <>
          {documentTypeField}
          {descriptionField}
        </>
      )}

      {inputMethod === "file" && (
        <div className="file-upload-container">
          {!tempFile ? (
            <div className="file-upload-area">
              <i
                className={`bx ${
                  fileType === "image" ? "bx-cloud-upload" : "bx-file"
                }`}
              ></i>
              <p>Click to browse files</p>
              <input
                type="file"
                ref={fileInputRef}
                accept={acceptedFileTypes}
                className="file-input"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                multiple={fileType === "image"}
              />
              <Button
                label="Browse Files"
                onClick={handleBrowseFiles}
                className="btn-outline"
              />
            </div>
          ) : (
            <div>
              <div className="selected-file">
                <p>
                  Selected file: {tempFile.name} (
                  {formatFileSize(tempFile.size)})
                </p>
              </div>
              <div className="form-actions">
                <Button
                  label="Cancel"
                  onClick={() => {
                    setTempFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="btn-default"
                  icon={<i className="bx bx-x"></i>}
                />
                {fileType === "document" && (
                  <Button
                    label="Add Document"
                    onClick={() => {
                      onFileAdded({
                        fileName: tempFile.name,
                        fileSize: tempFile.size,
                        file: tempFile,
                      });
                      setTempFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="btn-primary"
                    icon={<i className="bx bx-plus"></i>}
                  />
                )}
              </div>
            </div>
          )}
          {uploadInstructions && (
            <div className="upload-instructions">
              <p>{uploadInstructions}</p>
              <p>
                {fileType === "image"
                  ? "Formats: JPG, PNG, WEBP"
                  : "Formats: PDF, DOC, DOCX, XLS, XLSX"}
              </p>
            </div>
          )}
        </div>
      )}

      {inputMethod === "url" && (
        <div className="form-fields">
          <FormField>
            <FormLabel
              htmlFor="externalUrl"
              label={fileType === "image" ? "Image URL" : "Document URL"}
              required
            />
            <FormInput
              id="externalUrl"
              name="externalUrl"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder={`Enter ${fileType} URL`}
              hasError={false}
            />
            <small className="form-help-text">
              Provide a URL to an externally hosted {fileType}
            </small>
          </FormField>
          <div className="form-actions">
            <Button
              label={fileType === "image" ? "Add Image" : "Add Document"}
              onClick={handleUrlAdd}
              className="btn-primary"
              icon={<i className="bx bx-plus"></i>}
            />
          </div>
        </div>
      )}
    </>
  );
}
