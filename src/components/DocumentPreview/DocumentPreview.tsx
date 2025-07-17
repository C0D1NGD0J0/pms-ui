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
  templateId,
  variables = {},
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
  onError,
  onLoadError,
}) => {
  const [resolvedContent, setResolvedContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Resolve content based on type
  useEffect(() => {
    let isCancelled = false;

    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!urlValid) {
          throw new Error("Invalid or unauthorized URL");
        }

        const resolved = await resolveContent(
          type,
          content,
          url,
          templateId,
          variables
        );

        if (!isCancelled) {
          setResolvedContent(resolved);
        }
      } catch (err) {
        if (!isCancelled) {
          const errorMessage =
            err instanceof Error ? err.message : "Unknown error";
          setError(errorMessage);
          onError?.(new Error(errorMessage));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isCancelled = true;
    };
  }, [type, content, url, templateId, variables, urlValid, onError]);

  // Create blob URL for direct rendering
  useEffect(() => {
    if (
      renderMode === "iframe" &&
      (type === "html" || type === "template") &&
      resolvedContent
    ) {
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
    setError(err.message);
    onLoadError?.(err);
  };

  // Security check for external content
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

  // Loading state
  if (loading) {
    return (
      <div
        className={`document-preview loading ${className}`}
        style={{ height, width }}
      >
        <div className="loading-message">
          <p>Loading {title || "document"}...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    const fallback = fallbackContent ? (
      <div dangerouslySetInnerHTML={{ __html: fallbackContent }} />
    ) : (
      <div className="error-message">
        <p>Failed to load document: {error}</p>
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

  // Get sandbox attributes
  const sandboxAttr = getSandboxAttributes(type, external, sandbox);

  // Render based on mode
  const renderContent = () => {
    switch (renderMode) {
      case "iframe":
        const src = blobUrl || resolvedContent;
        return (
          <iframe
            src={src}
            title={title}
            width={width}
            height={height}
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
    <div className={`document-preview ${className}`} style={{ height, width }}>
      {renderContent()}
    </div>
  );
};
