import React from "react";
import { Button } from "@components/FormElements";

const documentsData = [
  {
    id: "1",
    title: "Lease Agreement",
    description: "Signed on January 1, 2024 • PDF • 2.3 MB",
    icon: "bx-file",
  },
  {
    id: "2",
    title: "Property Inspection Report",
    description: "March 15, 2025 • PDF • 4.7 MB",
    icon: "bx-file",
  },
  {
    id: "3",
    title: "Insurance Certificate",
    description: "Valid until December 31, 2025 • PDF • 1.2 MB",
    icon: "bx-file",
  },
  {
    id: "4",
    title: "Property Tax Statement",
    description: "2024 Tax Year • PDF • 0.8 MB",
    icon: "bx-file",
  },
  {
    id: "5",
    title: "Maintenance History",
    description: "Last updated June 20, 2025 • PDF • 3.1 MB",
    icon: "bx-file",
  },
];

export function DocumentsTab() {
  return (
    <div className="documents-tab">
      <div className="document-list">
        {documentsData.map((document) => (
          <div key={document.id} className="document-item">
            <div className="document-icon">
              <i className={`bx ${document.icon}`}></i>
            </div>
            <div>
              <h4>{document.title}</h4>
              <p>{document.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="form-actions"
        style={{ marginTop: "1rem", justifyContent: "flex-end" }}
      >
        <Button
          className="btn btn-primary"
          label="Upload Document"
          icon={<i className="bx bx-plus"></i>}
        />
      </div>
    </div>
  );
}
