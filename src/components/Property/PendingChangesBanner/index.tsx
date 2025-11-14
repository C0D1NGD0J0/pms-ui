"use client";
import React from "react";
import { IPropertyDocument } from "@interfaces/property.interface";
import { PendingChangesBanner as GenericPendingChangesBanner } from "@components/PendingChangesBanner";

interface PendingChangesBannerProps {
  property: IPropertyDocument;
  pendingChanges: any;
  requesterName: string;
  onViewChanges: () => void;
}

/**
 * @deprecated Use the generic PendingChangesBanner from @components/PendingChangesBanner instead
 * This wrapper is kept for backwards compatibility
 */
export const PendingChangesBanner: React.FC<PendingChangesBannerProps> = ({
  property,
  pendingChanges,
  requesterName,
  onViewChanges,
}) => {
  return (
    <GenericPendingChangesBanner
      entityType="property"
      pendingChanges={pendingChanges}
      requesterName={requesterName}
      updatedAt={property.updatedAt}
      onViewChanges={onViewChanges}
    />
  );
};
