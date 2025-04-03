enum DataRetentionPolicy {
  STANDARD = "standard",
  EXTENDED = "extended",
  MINIMAL = "minimal",
}
export interface GDPRSettings {
  dataRetentionPolicy: DataRetentionPolicy;
  dataProcessingConsent: boolean;
  processingConsentDate: Date;
  retentionExpiryDate: Date;
}
