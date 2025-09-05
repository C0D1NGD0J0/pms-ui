"use client";
import React, { useState, useRef } from "react";
import { Button } from "@components/FormElements";

interface FileInputProps {
  accept: string;
  multiImage?: boolean;
  onChange: (files: File | File[] | null) => void;
  instructionText?: string;
  maxFiles?: number;
  showPreview?: boolean;
}

export function FileInput({
  accept,
  onChange,
  instructionText,
  multiImage = false,
  maxFiles = 5,
  showPreview = false,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (multiImage) {
      // Handle multiple files
      const limitedFiles = maxFiles ? files.slice(0, maxFiles) : files;
      setSelectedFiles(limitedFiles);
      onChange(limitedFiles.length > 0 ? limitedFiles : null);
    } else {
      // Handle single file
      const file = files[0] || null;
      setSelectedFiles(file ? [file] : []);
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
      setSelectedFiles(newFiles);
      onChange(newFiles.length > 0 ? newFiles : null);
    } else {
      // Remove all files
      setSelectedFiles([]);
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
                  {showPreview && file.type.startsWith("image/") ? (
                    <div className="file-preview">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "contain",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="file-icon">
                      <i className="bx bx-file"></i>
                    </div>
                  )}
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
              {showPreview && selectedFiles[0].type.startsWith("image/") ? (
                <div className="file-preview">
                  <img
                    src={URL.createObjectURL(selectedFiles[0])}
                    alt={selectedFiles[0].name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ) : (
                <div className="file-icon">
                  <i className="bx bx-file"></i>
                </div>
              )}
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
