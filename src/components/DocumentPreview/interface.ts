export type DocumentType = "html" | "pdf" | "url" | "template" | "image";
export type RenderMode = "iframe" | "direct" | "embed" | "object";

export interface DocumentPreviewProps {
  // Content source
  content?: string;
  url?: string;
  templateId?: string;

  // Content type and rendering
  type: DocumentType;
  renderMode: RenderMode;

  // Template variables (for dynamic templates)
  variables?: Record<string, any>;

  // URL configuration
  isExternalUrl?: boolean;
  allowExternalContent?: boolean;
  corsProxy?: string;

  // Display options
  title?: string;
  className?: string;
  height?: string;
  width?: string;

  // Security options
  sandbox?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;

  // Error handling
  fallbackContent?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onLoadError?: (error: Error) => void;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  previewProps: DocumentPreviewProps;
  size?: "small" | "medium" | "large";
}

export interface TemplateData {
  templateType: string;
  displayName: string;
  htmlContent: string;
  textContent: string;
  layout: {
    htmlLayout: string;
    textLayout: string;
  };
  requiredVariables: string[];
  optionalVariables: string[];
  supportsCustomMessage: boolean;
}

export interface EmailTemplateResponse {
  success: boolean;
  data: TemplateData;
}
