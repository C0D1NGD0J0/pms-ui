"use client";
import React, { useState, useRef } from "react";
import { Button } from "@components/FormElements";
import { FormSection } from "@components/FormLayout";

export function DocumentsTab() {
  // State for uploaded files
  const [propertyImages, setPropertyImages] = useState<File[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<File[]>([]);

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPropertyImages((prev) => {
        // Limit to 5 images max
        const combined = [...prev, ...newFiles];
        return combined.slice(0, 5);
      });
    }
  };

  // Handle document upload
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPropertyDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  // Trigger file input click
  const handleBrowseImages = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleBrowseDocuments = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  return (
    <>
      {/* Property Images section */}
      <FormSection
        title="Property Images"
        description="Upload images of the property (max 5 files, 3MB each)"
      >
        <div className="file-upload-container">
          <div className="file-upload-area">
            <i className="bx bx-cloud-upload"></i>
            <p>Click to browse files</p>
            <input
              type="file"
              ref={imageInputRef}
              multiple
              accept="image/*"
              className="file-input"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Button
              label="Browse Files"
              onClick={handleBrowseImages}
              className="btn-outline"
            />
          </div>
          <div className="uploaded-files">
            <div className="upload-instructions">
              <p>
                Recommended: Upload photos of all rooms, exterior views, and
                special features
              </p>
              <p>Formats: JPG, PNG, WEBP</p>
            </div>
            <ul className="file-list">
              {propertyImages.map((file, index) => (
                <li key={`img-${index}`} className="file-item">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FormSection>

      {/* Property Documents section */}
      <FormSection
        title="Property Documents"
        description="Upload property-related documents (deeds, certificates, etc.)"
      >
        <div className="file-upload-container">
          <div className="file-upload-area">
            <i className="bx bx-file"></i>
            <p>Drag and drop documents here or click to browse</p>
            <input
              type="file"
              ref={documentInputRef}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              className="file-input"
              onChange={handleDocumentUpload}
              style={{ display: "none" }}
            />
            <Button
              label="Browse Files"
              onClick={handleBrowseDocuments}
              className="btn-outline"
            />
          </div>
          <div className="uploaded-files">
            <div className="upload-instructions">
              <p>
                Suggested documents: Deed, Property tax records, Insurance
                documents
              </p>
              <p>Formats: PDF, DOC, DOCX, XLS, XLSX</p>
            </div>
            <ul className="document-list">
              {propertyDocuments.map((file, index) => (
                <li key={`doc-${index}`} className="file-item">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FormSection>
    </>
  );
}
