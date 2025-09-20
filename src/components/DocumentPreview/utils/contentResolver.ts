import { DocumentType } from "../interface";

/**
 * Determines if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // blob: and data: URLs are considered local/internal
    if (urlObj.protocol === "blob:" || urlObj.protocol === "data:") {
      return false;
    }
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false; // Relative URLs are internal
  }
}

/**
 * Creates a blob URL from content for iframe rendering
 */
export function createBlobUrl(content: string | File, type?: string): string {
  if (content instanceof File) {
    // Use the file's natural MIME type or detect it
    const mimeType = type || content.type || detectMimeType(content.name);
    return URL.createObjectURL(
      new File([content], content.name, { type: mimeType })
    );
  }

  const mimeType = type || "text/html";
  const blob = new Blob([content], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Detects MIME type from file extension
 */
export function detectMimeType(filename: string): string {
  const ext = filename.toLowerCase().split(".").pop() || "";

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    html: "text/html",
    htm: "text/html",
    txt: "text/plain",
  };

  return mimeTypes[ext] || "application/octet-stream";
}

/**
 * Determines if a file is a PDF based on extension or MIME type
 */
export function isPdfFile(filename: string, mimeType?: string): boolean {
  const ext = filename.toLowerCase().split(".").pop() || "";
  return ext === "pdf" || mimeType === "application/pdf";
}

/**
 * Determines if a file is an image based on extension or MIME type
 */
export function isImageFile(filename: string, mimeType?: string): boolean {
  const ext = filename.toLowerCase().split(".").pop() || "";
  const imageExts = ["jpg", "jpeg", "png", "gif"];
  return imageExts.includes(ext) || mimeType?.startsWith("image/") || false;
}

/**
 * Resolves content based on the document type and source
 * This is now a pure function with no side effects
 */
export function resolveContent(
  type: DocumentType,
  content?: string,
  url?: string
): string {
  switch (type) {
    case "html":
      return content || "";

    case "pdf":
    case "url":
    case "image":
      return url || "";

    default:
      return content || url || "";
  }
}

/**
 * Validates URL for security
 */
export function validateUrl(
  url: string,
  allowExternal: boolean = true
): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const isExternal = isExternalUrl(url);

    // Block dangerous protocols
    if (!["http:", "https:", "data:", "blob:"].includes(urlObj.protocol)) {
      return false;
    }

    // Check external URL policy
    if (isExternal && !allowExternal) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Gets appropriate sandbox attributes for iframe based on content type
 */
export function getSandboxAttributes(
  type: DocumentType,
  isExternal: boolean,
  customSandbox?: string
): string {
  if (customSandbox) {
    return customSandbox;
  }

  if (isExternal) {
    // For external PDFs, we need permissive sandbox but no downloads
    return "allow-same-origin allow-scripts allow-popups allow-forms";
  }

  switch (type) {
    case "html":
      return "allow-scripts allow-same-origin";
    case "pdf":
      return "allow-same-origin";
    default:
      return "allow-same-origin";
  }
}

/**
 * For external PDFs, use Google Docs viewer via object mode
 */
export function getOptimalRenderMode(
  type: DocumentType,
  isExternal: boolean,
  requestedMode: string
): string {
  // For external PDFs, use object mode (which will render with Google Docs viewer)
  if (type === "pdf" && isExternal) {
    return "object";
  }

  return requestedMode;
}
