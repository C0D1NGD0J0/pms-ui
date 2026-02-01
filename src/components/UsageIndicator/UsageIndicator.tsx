"use client";
import React from "react";
import { useEntitlements } from "@src/hooks/contexts";

interface UsageIndicatorProps {
  resource: "property" | "unit" | "user";
  showUpgradePrompt?: boolean;
  warningThreshold?: number; // Show warning when usage exceeds this % (default 80%)
}

export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  resource,
  showUpgradePrompt = true,
  warningThreshold = 80,
}) => {
  const { getUsageInfo, isLimitReached, showUpgradeModal } = useEntitlements();
  const usageInfo = getUsageInfo(resource);

  const { current, limit, remaining, percentage } = usageInfo;
  const isNearLimit = percentage >= warningThreshold;
  const isAtLimit = isLimitReached(resource);

  const resourceLabels = {
    property: "Properties",
    unit: "Units",
    user: "Team Members",
  };

  const getStatusClass = () => {
    if (isAtLimit) return "usage-indicator--danger";
    if (isNearLimit) return "usage-indicator--warning";
    return "usage-indicator--normal";
  };

  const handleUpgradeClick = () => {
    const upgradeReasons = {
      property: "You've reached your property limit",
      unit: "You've reached your unit limit",
      user: "You've reached your team member limit",
    };
    showUpgradeModal(upgradeReasons[resource]);
  };

  return (
    <div className={`usage-indicator ${getStatusClass()}`}>
      <div className="usage-indicator__header">
        <span className="usage-indicator__label">
          {resourceLabels[resource]}
        </span>
        <span className="usage-indicator__count">
          {current} / {limit}
        </span>
      </div>

      <div className="usage-indicator__progress">
        <div
          className="usage-indicator__progress-bar"
          style={{ width: `${percentage}%` }}
          aria-label={`${percentage}% used`}
        />
      </div>

      <div className="usage-indicator__footer">
        <span className="usage-indicator__remaining">
          {remaining} remaining
        </span>

        {showUpgradePrompt && (isAtLimit || isNearLimit) && (
          <button
            className="usage-indicator__upgrade-btn"
            onClick={handleUpgradeClick}
          >
            {isAtLimit ? "Upgrade Required" : "Upgrade Plan"}
          </button>
        )}
      </div>
    </div>
  );
};
