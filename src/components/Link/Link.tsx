"use client";
import React from "react";
import NextLink from "next/link";
import { useEntitlements } from "@src/hooks/contexts";

interface LinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  href: string;
  // Next.js specific props
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  // Entitlement-based blocking
  requiresFeature?: string;
  requiresCapacity?: "property" | "unit" | "user";
  onBlocked?: () => void;
  // Analytics/tracking
  trackingData?: {
    event?: string;
    category?: string;
    label?: string;
    [key: string]: any;
  };
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  onClick,
  // Next.js specific props
  prefetch,
  replace,
  scroll,
  shallow,
  // Custom props
  requiresFeature,
  requiresCapacity,
  onBlocked,
  trackingData,
  ...htmlProps
}) => {
  const { hasFeature, canCreate, showUpgradeModal } = useEntitlements();

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//");

  const isMailto = href.startsWith("mailto:");
  const isTel = href.startsWith("tel:");

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check feature requirement
    if (requiresFeature && !hasFeature(requiresFeature)) {
      e.preventDefault();
      if (onBlocked) {
        onBlocked();
      } else {
        showUpgradeModal(`This feature requires an upgrade`);
      }
      return;
    }

    // Check capacity requirement
    if (requiresCapacity && !canCreate(requiresCapacity)) {
      e.preventDefault();
      if (onBlocked) {
        onBlocked();
      } else {
        showUpgradeModal(`You've reached your ${requiresCapacity} limit`);
      }
      return;
    }

    // Track the click if tracking data provided
    if (trackingData) {
      // TODO: Integrate with analytics service (Google Analytics, Mixpanel, etc.)
      console.log("[Link Click Analytics]", {
        href,
        ...trackingData,
        timestamp: new Date().toISOString(),
      });
    }

    // Call custom onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  // External links or special protocols
  if (isExternal || isMailto || isTel) {
    const defaultRel =
      htmlProps.target === "_blank" ? "noopener noreferrer" : undefined;
    return (
      <a
        {...htmlProps}
        href={href}
        rel={htmlProps.rel || defaultRel}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  // Internal Next.js links
  return (
    <NextLink
      {...htmlProps}
      href={href}
      onClick={handleClick}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      {children}
    </NextLink>
  );
};
