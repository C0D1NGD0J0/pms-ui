"use client";
import React from "react";
import { Banner } from "@components/Banner";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@components/Badge/Badge";

interface PendingChangesBannerProps {
  entityType: "property" | "lease" | "tenant" | "unit" | string;
  pendingChanges: any;
  requesterName: string;
  updatedAt: string;
  onViewChanges: () => void;
}

export const PendingChangesBanner: React.FC<PendingChangesBannerProps> = ({
  entityType,
  pendingChanges,
  requesterName,
  updatedAt,
  onViewChanges,
}) => {
  const getChangesCount = (): number => {
    if (!pendingChanges?.changes) return 0;
    const changes = Object.entries(pendingChanges.changes).filter(
      ([key]) => !["updatedBy", "updatedAt"].includes(key)
    );
    return changes.length;
  };

  const changesCount = getChangesCount();

  if (!pendingChanges || changesCount === 0) {
    return null;
  }

  const description = (
    <>
      <Badge
        variant="warning"
        text={`${changesCount} field${changesCount !== 1 ? "s" : ""} modified`}
      />
      <span>
        by <strong>{requesterName}</strong> •{" "}
        {formatDistanceToNow(new Date(updatedAt), {
          addSuffix: true,
        })}
      </span>
    </>
  );

  return (
    <Banner
      type="warning"
      title={`This ${entityType} has pending changes awaiting approval`}
      description={description}
      icon="bx-time-five"
      actions={[
        {
          label: "View Changes",
          onClick: onViewChanges,
          variant: "secondary",
        },
      ]}
    />
  );
};
