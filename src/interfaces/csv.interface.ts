export interface CsvValidationResult {
  success: boolean;
  data?: {
    processId: string;
    validRecords: number;
    invalidRecords: number;
    validData?: any[];
  };
  message: string;
  errors?: Array<{ row: number; message: string }>;
}

export interface CsvProcessResult {
  success: boolean;
  data: {
    processed: number;
  };
  message: string;
}

export interface CsvServiceMethods {
  validateCsv: (file: File) => Promise<CsvValidationResult>;
  processCsv: (processId: string) => Promise<CsvProcessResult>;
}

export interface CsvUploadConfig {
  title: string;
  description: string;
  templateUrl: string;
  templateName: string;
  columns: Array<{
    name: string;
    description: string;
    required?: boolean;
  }>;
  showPreview?: boolean;
  serviceMethods: CsvServiceMethods;
}