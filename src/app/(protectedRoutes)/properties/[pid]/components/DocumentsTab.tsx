import React from "react";
import { DocumentsList, Document } from "@components/Property";

const documentsData: Document[] = [
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
  const handleDownload = (documentId: string) => {
    console.log("Download document:", documentId);
  };

  const handleUpload = () => {
    console.log("Upload new document");
  };

  return (
    <DocumentsList
      viewType="landlord"
      documents={documentsData}
      onDownload={handleDownload}
      onUpload={handleUpload}
    />
  );
}
