"use client";
import React, { useEffect, useState, useMemo } from "react";

import { DocumentPreviewProps } from "./interface";
import {
  getSandboxAttributes,
  resolveContent,
  createBlobUrl,
  isExternalUrl,
  validateUrl,
} from "./utils/contentResolver";

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  type,
  renderMode,
  content,
  url,
  isExternalUrl: forceExternal,
  allowExternalContent = true,
  sandbox,
  referrerPolicy = "no-referrer-when-downgrade",
  className = "",
  height = "600px",
  width = "100%",
  title,
  fallbackContent,
  onLoad,
  onLoadError,
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Determine if URL is external
  const external = useMemo(() => {
    if (forceExternal !== undefined) return forceExternal;
    return url ? isExternalUrl(url) : false;
  }, [url, forceExternal]);

  // Validate URL if provided
  const urlValid = useMemo(() => {
    if (!url) return true;
    return validateUrl(url, allowExternalContent);
  }, [url, allowExternalContent]);

  // Resolve content synchronously
  const resolvedContent = useMemo(() => {
    if (!urlValid) {
      return "";
    }
    return resolveContent(type, content, url);
  }, [type, content, url, urlValid]);

  // Create blob URL for direct rendering
  useEffect(() => {
    if (renderMode === "iframe" && type === "html" && resolvedContent) {
      const blob = createBlobUrl(resolvedContent);
      setBlobUrl(blob);

      return () => {
        if (blob) {
          URL.revokeObjectURL(blob);
        }
      };
    }
  }, [renderMode, type, resolvedContent]);

  // Handle load events
  const handleLoad = () => {
    onLoad?.();
  };

  const handleLoadError = (err: Error) => {
    onLoadError?.(err);
  };

  if (external && !allowExternalContent) {
    return (
      <div
        className={`document-preview error ${className}`}
        style={{ height, width }}
      >
        <div className="error-message">
          <p>External content is not allowed</p>
        </div>
      </div>
    );
  }

  if (!resolvedContent) {
    const fallback = fallbackContent ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
    ) : (
      <div className="error-message">
        <p>No content provided</p>
      </div>
    );

    return (
      <div
        className={`document-preview error ${className}`}
        style={{ height, width }}
      >
        {fallback}
      </div>
    );
  }

  const sandboxAttr = getSandboxAttributes(type, external, sandbox);

  const renderContent = () => {
    switch (renderMode) {
      case "iframe":
        const src = blobUrl || resolvedContent;
        return (
          <iframe
            src={src}
            title={title}
            width={width}
            height={"100%"}
            sandbox={sandboxAttr}
            referrerPolicy={referrerPolicy}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load iframe content"))
            }
            style={{ border: "none" }}
          />
        );

      case "direct":
        return (
          <div
            className="direct-content"
            style={{ height, width, overflow: "auto" }}
            dangerouslySetInnerHTML={{ __html: resolvedContent }}
          />
        );

      case "embed":
        return (
          <embed
            src={resolvedContent}
            type="application/pdf"
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load embedded content"))
            }
          />
        );

      case "object":
        return (
          <object
            data={resolvedContent}
            type="application/pdf"
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load object content"))
            }
          >
            <p>Your browser does not support embedded content.</p>
          </object>
        );

      default:
        return (
          <div className="unsupported-mode">
            <p>Unsupported render mode: {renderMode}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`document-preview ${className}`}
      style={{ height: "40rem", width }}
    >
      {renderContent()}
    </div>
  );
};
