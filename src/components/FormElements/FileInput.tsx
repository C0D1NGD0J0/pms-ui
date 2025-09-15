"use client";
import React, { useState, useRef } from "react";
import { Button } from "@components/FormElements";

interface FileInputProps {
  accept: string;
  multiImage?: boolean;
  onChange: (files: File | File[] | null) => void;
  instructionText?: string;
  maxFiles?: number;
  totalSizeAllowed?: number; // in MB
  onError?: (message: string) => void;
}

export function FileInput({
  accept,
  onChange,
  instructionText,
  multiImage = false,
  maxFiles = 5,
  totalSizeAllowed,
  onError,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const calculateTotalSize = (files: File[]) => {
    return files.reduce((total, file) => total + file.size, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (multiImage) {
      // Handle multiple files
      const limitedFiles = maxFiles ? files.slice(0, maxFiles) : files;
      const newTotalSize = calculateTotalSize(limitedFiles);

      // Check total size limit if specified
      if (totalSizeAllowed && newTotalSize > totalSizeAllowed * 1024 * 1024) {
        if (onError) {
          onError(`Total file size cannot exceed ${totalSizeAllowed}MB`);
        }
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFiles(limitedFiles);
      setTotalSize(newTotalSize);
      onChange(limitedFiles.length > 0 ? limitedFiles : null);
    } else {
      // Handle single file
      const file = files[0] || null;
      const newTotalSize = file ? file.size : 0;

      // Check total size limit if specified
      if (
        totalSizeAllowed &&
        file &&
        newTotalSize > totalSizeAllowed * 1024 * 1024
      ) {
        if (onError) {
          onError(`File size cannot exceed ${totalSizeAllowed}MB`);
        }
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setSelectedFiles(file ? [file] : []);
      setTotalSize(newTotalSize);
      onChange(file);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = (index?: number) => {
    if (multiImage && typeof index === "number") {
      // Remove specific file from multiple selection
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const newTotalSize = calculateTotalSize(newFiles);
      setSelectedFiles(newFiles);
      setTotalSize(newTotalSize);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      // Remove all files
      setSelectedFiles([]);
      setTotalSize(0);
      onChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="file-input-container">
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        multiple={multiImage}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {totalSizeAllowed && multiImage && (
        <div className="file-size-info">
          <p
            style={{ fontSize: "12px", color: "#7d8da1", marginBottom: "8px" }}
          >
            <strong>Files:</strong> {selectedFiles.length}/{maxFiles} |
            <strong> Total size:</strong> {formatFileSize(totalSize)}/
            {totalSizeAllowed}MB
          </p>
        </div>
      )}

      {selectedFiles.length === 0 ? (
        <div className="file-upload-area">
          <i className="bx bx-file"></i>
          <p>Select {multiImage ? "files" : "a file"} to upload</p>
          {instructionText && <p className="help-text">{instructionText}</p>}
          <Button
            label="Browse Files"
            onClick={handleBrowseClick}
            className="btn-outline"
          />
        </div>
      ) : (
        <div className="selected-files">
          {multiImage ? (
            // Multiple files display
            <div className="files-grid">
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} className="file-item">
                  <div className="file-icon">
                    <i className="bx bx-file"></i>
                  </div>
                  <div className="file-info">
                    <span className="file-name" title={file.name}>
                      {file.name.length > 15
                        ? `${file.name.substring(0, 15)}...`
                        : file.name}
                    </span>
                    <span className="file-size">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    label=""
                    onClick={() => handleRemoveFile(index)}
                    className="btn-sm btn-rounded btn-primary"
                    icon={<i className="bx bx-x"></i>}
                  />
                </div>
              ))}
              <div className="add-more-files">
                <Button
                  label="Add More"
                  onClick={handleBrowseClick}
                  className="btn-outline btn-sm"
                  disabled={selectedFiles.length >= maxFiles}
                />
              </div>
            </div>
          ) : (
            // Single file display
            <div className="selected-file">
              <div className="file-icon">
                <i className="bx bx-file"></i>
              </div>
              <div className="file-info">
                <span className="file-name">{selectedFiles[0].name}</span>
                <span className="file-size">
                  ({(selectedFiles[0].size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                label=""
                onClick={() => handleRemoveFile()}
                className="btn-sm btn-rounded btn-primary"
                icon={<i className="bx bx-x"></i>}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
