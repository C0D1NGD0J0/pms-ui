"use client";
import React, { useCallback, useState, useMemo } from "react";

import { DocumentPreviewProps, RenderMode } from "./interface";
import {
  getSandboxAttributes,
  getOptimalRenderMode,
  resolveContent,
  isExternalUrl,
  validateUrl,
  isImageFile,
  isPdfFile,
} from "./utils/contentResolver";

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  type,
  renderMode,
  content,
  url,
  isExternalUrl: forceExternal,
  allowExternalContent = true,
  className = "",
  height = "600px",
  width = "100%",
  title,
  fallbackContent,
  onLoad,
  onLoadError,
}) => {
  // Determine if URL is external
  const external = useMemo(() => {
    if (forceExternal !== undefined) return forceExternal;
    return url ? isExternalUrl(url) : false;
  }, [url, forceExternal]);

  // Determine if content is PDF based on URL/filename
  const contentIsPdf = useMemo(() => {
    if (type === "pdf") return true;
    if (url) {
      const filename = url.split("/").pop() || "";
      return isPdfFile(filename);
    }
    return false;
  }, [type, url]);

  // Use optimal render mode for external PDFs
  const optimalRenderMode = useMemo(() => {
    return getOptimalRenderMode(type, external, renderMode) as RenderMode;
  }, [type, external, renderMode]);

  const [currentRenderMode, setCurrentRenderMode] =
    useState<RenderMode>(optimalRenderMode);
  const [hasError, setHasError] = useState(false);

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

  const contentIsImage = useMemo(() => {
    if (type === "image") return true;
    if (url) {
      const filename = url.split("/").pop() || "";
      return isImageFile(filename);
    }
    return false;
  }, [type, url]);

  // PDF fallback chain: iframe -> embed -> object -> download link
  const pdfFallbackChain: RenderMode[] = ["iframe", "embed", "object"];

  // Handle load events
  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

  const handleLoadError = useCallback(
    (err: Error) => {
      if (contentIsPdf && !hasError) {
        const currentIndex = pdfFallbackChain.indexOf(currentRenderMode);
        const nextMode = pdfFallbackChain[currentIndex + 1];

        if (nextMode) {
          setCurrentRenderMode(nextMode);
          setHasError(false);
          return;
        }
      }

      setHasError(true);
      onLoadError?.(err);
    },
    [contentIsPdf, hasError, currentRenderMode, pdfFallbackChain, onLoadError]
  );

  // For external PDFs, set a timeout to detect iframe loading issues
  React.useEffect(() => {
    if (currentRenderMode === "iframe" && external && contentIsPdf) {
      const timer = setTimeout(() => {
        // Auto-fallback to object for external PDFs that don't load in iframe
        handleLoadError(new Error("Iframe load timeout for external PDF"));
      }, 3000); // 3 second timeout

      return () => clearTimeout(timer);
    }
  }, [currentRenderMode, external, contentIsPdf, handleLoadError]);

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

  const renderContent = () => {
    // If all PDF rendering methods failed, show unavailable message
    if (hasError && contentIsPdf) {
      return (
        <div
          className="pdf-fallback"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
            borderRadius: "8px",
          }}
        >
          <i
            className="bx bx-file-blank"
            style={{ fontSize: "3rem", marginBottom: "1rem", color: "#6c757d" }}
          />
          <h4 style={{ marginBottom: "0.5rem", color: "#495057" }}>
            PDF Preview Unavailable
          </h4>
          <p
            style={{
              marginBottom: "1rem",
              color: "#6c757d",
              textAlign: "center",
            }}
          >
            This PDF cannot be displayed at the moment. Please try again later.
          </p>
        </div>
      );
    }

    switch (currentRenderMode) {
      case "image":
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedContent}
            alt={title || "Preview"}
            decoding="async"
            fetchPriority="high"
            loading="eager"
            onLoad={handleLoad}
            onError={() => handleLoadError(new Error("Failed to load image"))}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: contentIsImage ? "contain" : "cover",
            }}
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
            type={contentIsPdf ? "application/pdf" : undefined}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load embedded content"))
            }
          />
        );

      case "object":
        // For external PDFs, use Google Docs viewer as it handles CORS better
        if (external && contentIsPdf) {
          const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            resolvedContent
          )}`;
          return (
            <iframe
              src={googleDocsUrl}
              width={width}
              height={height}
              title={title || "Document Preview"}
              onLoad={handleLoad}
              onError={() =>
                handleLoadError(new Error("Failed to load Google Docs viewer"))
              }
              style={{ border: "none" }}
            />
          );
        }

        // For local PDFs, use object element
        return (
          <object
            data={resolvedContent}
            type={contentIsPdf ? "application/pdf" : undefined}
            width={width}
            height={height}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load object content"))
            }
          >
            <p>This PDF cannot be displayed in your browser.</p>
          </object>
        );

      case "iframe":
        return (
          <iframe
            src={resolvedContent}
            width={width}
            height={height}
            title={title || "Document Preview"}
            sandbox={getSandboxAttributes(type, external)}
            onLoad={handleLoad}
            onError={() =>
              handleLoadError(new Error("Failed to load iframe content"))
            }
            style={{ border: "none" }}
          />
        );

      default:
        return (
          <div className="unsupported-mode">
            <p>Unsupported render mode: {currentRenderMode}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={`document-preview ${
        type === "image" ? "document-preview--image" : ""
      } ${className}`}
      style={renderMode === "image" ? { width: "100%" } : { height, width }}
    >
      {renderContent()}
    </div>
  );
};
