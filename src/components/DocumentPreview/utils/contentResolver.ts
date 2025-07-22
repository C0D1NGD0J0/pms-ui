import { DocumentType } from "../interface";

/**
 * Determines if a URL is external
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false; // Relative URLs are internal
  }
}

/**
 * Creates a blob URL from HTML content for iframe rendering
 */
export function createBlobUrl(
  content: string,
  type: string = "text/html"
): string {
  const blob = new Blob([content], { type });
  return URL.createObjectURL(blob);
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
    return "allow-scripts allow-same-origin allow-popups allow-forms";
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
