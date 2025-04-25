"use client";
import React, { useState, useRef } from "react";
import { Button } from "@components/FormElements";

interface FileInputProps {
  accept: string;
  onChange: (file: File | null) => void;
  instructionText?: string;
}

export function FileInput({
  accept,
  onChange,
  instructionText,
}: FileInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="file-input-container">
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {!selectedFile ? (
        <div className="file-upload-area">
          <i className="bx bx-file"></i>
          <p>Select a file to upload</p>
          {instructionText && <p className="help-text">{instructionText}</p>}
          <Button
            label="Browse Files"
            onClick={handleBrowseClick}
            className="btn-outline"
          />
        </div>
      ) : (
        <div className="selected-file">
          <div className="file-info">
            <i className="bx bx-file"></i>
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">
              ({(selectedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button
            label=""
            onClick={handleRemoveFile}
            className="btn-sm btn-rounded"
            icon={<i className="bx bx-x"></i>}
          />
        </div>
      )}
    </div>
  );
}
