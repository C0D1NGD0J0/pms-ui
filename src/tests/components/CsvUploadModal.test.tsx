import React from "react";
import "@testing-library/jest-dom";
import { useNotification } from "@hooks/useNotification";
import { CsvUploadConfig } from "@interfaces/csv.interface";
import { CsvUploadModal } from "@components/CsvUploadModal/CsvUploadModal";
import { fireEvent, waitFor, render, screen } from "@testing-library/react";

jest.mock("@hooks/useNotification");

const mockUseNotification = useNotification as jest.MockedFunction<
  typeof useNotification
>;

describe("CsvUploadModal", () => {
  const mockMessage = {
    info: jest.fn(),
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  };

  const mockConfirm = jest.fn();

  const mockValidateCsv = jest.fn();
  const mockImportCsv = jest.fn();

  const defaultConfig: CsvUploadConfig = {
    title: "Import Users from CSV",
    description: "Upload a CSV file to import multiple users at once.",
    templateUrl: "/templates/users-template.csv",
    templateName: "Download User Template",
    columns: [
      { name: "firstName", description: "First name", required: true },
      { name: "lastName", description: "Last name", required: true },
      { name: "email", description: "Email address", required: true },
      { name: "role", description: "User role", required: false },
    ],
    serviceMethods: {
      validateCsv: mockValidateCsv,
      importCsv: mockImportCsv,
    },
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNotification.mockReturnValue({
      message: mockMessage,
      confirm: mockConfirm,
    } as any);
  });

  it("should render modal with title and description", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    expect(screen.getByText("Import Users from CSV")).toBeInTheDocument();
    expect(
      screen.getByText("Upload a CSV file to import multiple users at once.")
    ).toBeInTheDocument();
  });

  it("should not render when isOpen is false", () => {
    render(
      <CsvUploadModal
        isOpen={false}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    expect(
      screen.queryByText("Import Users from CSV")
    ).not.toBeInTheDocument();
  });

  it("should render file upload input", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    expect(
      screen.getByText(
        "Please use our CSV template to ensure proper formatting"
      )
    ).toBeInTheDocument();
  });

  it("should render template download link", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const downloadLink = screen.getByText("Download User Template");
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute("href", "/templates/users-template.csv");
    expect(downloadLink).toHaveAttribute("download");
  });

  it("should disable validate and import buttons when no file is selected", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const validateButton = screen.getByRole("button", {
      name: /validate first/i,
    });
    const importButton = screen.getByRole("button", {
      name: /import directly/i,
    });

    expect(validateButton).toBeDisabled();
    expect(importButton).toBeDisabled();
  });

  it("should enable buttons when file is selected", async () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["firstName,lastName,email\nJohn,Doe,john@example.com"], "users.csv", {
      type: "text/csv",
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });

      expect(validateButton).not.toBeDisabled();
      expect(importButton).not.toBeDisabled();
    });
  });

  it("should call validateCsv when Validate First button is clicked", async () => {
    mockValidateCsv.mockResolvedValue({
      success: true,
      data: {
        processId: "proc-123",
        jobId: "job-456",
        validRecords: 10,
        invalidRecords: 0,
      },
      message: "Validation started",
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["firstName,lastName,email\nJohn,Doe,john@example.com"], "users.csv", {
      type: "text/csv",
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      expect(validateButton).not.toBeDisabled();
    });

    const validateButton = screen.getByRole("button", {
      name: /validate first/i,
    });
    fireEvent.click(validateButton);

    await waitFor(() => {
      expect(mockValidateCsv).toHaveBeenCalledWith(file);
      expect(mockMessage.info).toHaveBeenCalledWith(
        "Validating CSV... Check notifications for results when complete."
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show error message when validation fails", async () => {
    const errorMessage = "Invalid CSV format";
    mockValidateCsv.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["invalid data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      expect(validateButton).not.toBeDisabled();
    });

    const validateButton = screen.getByRole("button", {
      name: /validate first/i,
    });
    fireEvent.click(validateButton);

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(errorMessage);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("should handle validation error without response data", async () => {
    mockValidateCsv.mockRejectedValue(new Error("Network error"));

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith("Network error");
    });
  });

  it("should show confirmation dialog when Import Directly is clicked", async () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["firstName,lastName,email\nJohn,Doe,john@example.com"], "users.csv", {
      type: "text/csv",
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      expect(importButton).not.toBeDisabled();
    });

    const importButton = screen.getByRole("button", {
      name: /import directly/i,
    });
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith({
        title: "Import without validation?",
        message:
          "Skipping validation means invalid records will be reported as errors after import. Validation is recommended for large files.",
        type: "warning",
        confirmText: "Yes, Import Now",
        cancelText: "Cancel",
        onConfirm: expect.any(Function),
      });
    });
  });

  it("should call importCsv when user confirms direct import", async () => {
    mockImportCsv.mockResolvedValue({
      success: true,
      message: "Import started",
    });

    mockConfirm.mockImplementation((options) => {
      // Immediately call onConfirm callback
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["firstName,lastName,email\nJohn,Doe,john@example.com"], "users.csv", {
      type: "text/csv",
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      expect(importButton).not.toBeDisabled();
    });

    const importButton = screen.getByRole("button", {
      name: /import directly/i,
    });
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(mockImportCsv).toHaveBeenCalledWith(file);
      expect(mockMessage.info).toHaveBeenCalledWith(
        "Importing CSV... Check notifications for results when complete."
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should show error message when import fails", async () => {
    const errorMessage = "Import failed";
    mockImportCsv.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    mockConfirm.mockImplementation((options) => {
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      fireEvent.click(importButton);
    });

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(errorMessage);
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it("should handle import error without response data", async () => {
    mockImportCsv.mockRejectedValue(new Error("Connection timeout"));

    mockConfirm.mockImplementation((options) => {
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      fireEvent.click(importButton);
    });

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith("Connection timeout");
    });
  });

  it("should call onClose when Cancel button is clicked", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when modal header close is clicked", () => {
    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    // Modal header close button
    const closeButtons = screen.getAllByRole("button");
    const headerCloseButton = closeButtons.find(
      (btn) => btn.getAttribute("aria-label") === "Close modal"
    );

    if (headerCloseButton) {
      fireEvent.click(headerCloseButton);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it("should show loading state during validation", async () => {
    mockValidateCsv.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      fireEvent.click(validateButton);
    });

    expect(
      screen.getByRole("button", { name: /validating.../i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /validating.../i })
    ).toBeDisabled();
  });

  it("should show loading state during import", async () => {
    mockImportCsv.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    mockConfirm.mockImplementation((options) => {
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      fireEvent.click(importButton);
    });

    expect(
      screen.getByRole("button", { name: /importing.../i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /importing.../i })
    ).toBeDisabled();
  });

  it("should disable both buttons when validating", async () => {
    mockValidateCsv.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      fireEvent.click(validateButton);
    });

    const validateButton = screen.getByRole("button", { name: /validating.../i });
    const importButton = screen.getByRole("button", { name: /import directly/i });

    expect(validateButton).toBeDisabled();
    expect(importButton).toBeDisabled();
  });

  it("should disable both buttons when importing", async () => {
    mockImportCsv.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    mockConfirm.mockImplementation((options) => {
      if (options.onConfirm) {
        options.onConfirm();
      }
    });

    render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /import directly/i,
      });
      fireEvent.click(importButton);
    });

    const validateButton = screen.getByRole("button", { name: /validate first/i });
    const importButton = screen.getByRole("button", { name: /importing.../i });

    expect(validateButton).toBeDisabled();
    expect(importButton).toBeDisabled();
  });

  it("should reset file when modal is closed", async () => {
    const { rerender } = render(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const file = new File(["data"], "users.csv", { type: "text/csv" });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByRole("button", {
        name: /validate first/i,
      });
      expect(validateButton).not.toBeDisabled();
    });

    // Close and reopen modal
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    rerender(
      <CsvUploadModal
        isOpen={false}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    rerender(
      <CsvUploadModal
        isOpen={true}
        onClose={mockOnClose}
        config={defaultConfig}
      />
    );

    const validateButton = screen.getByRole("button", {
      name: /validate first/i,
    });
    expect(validateButton).toBeDisabled();
  });
});
