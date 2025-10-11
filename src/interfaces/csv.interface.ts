export interface CsvValidationResult {
  success: boolean;
  data?: {
    processId: string;
    jobId: string;
    validRecords: number;
    invalidRecords: number;
    validData?: any[];
  };
  message: string;
}

export interface CsvServiceMethods {
  validateCsv: (file: File) => Promise<CsvValidationResult>;
  importCsv: (file: File) => Promise<{ success: boolean; message: string }>;
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
  serviceMethods: CsvServiceMethods;
}
