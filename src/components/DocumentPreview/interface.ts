export type DocumentType = "html" | "pdf" | "url" | "image";
export type RenderMode = "iframe" | "direct" | "embed" | "object";

export interface DocumentPreviewProps {
  // Content source - only one should be provided
  content?: string;
  url?: string;

  // Content type and rendering
  type: DocumentType;
  renderMode: RenderMode;

  // URL configuration
  isExternalUrl?: boolean;
  allowExternalContent?: boolean;

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
  onLoadError?: (error: Error) => void;
}

export interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  previewProps: DocumentPreviewProps;
  size?: "small" | "medium" | "large";
  destroyOnHidden?: boolean;
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
