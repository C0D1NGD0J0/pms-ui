import React from "react";

interface NotificationErrorListProps {
  errors: any[];
  errorCount: number;
  isJobError: boolean;
}

const NotificationErrorList: React.FC<NotificationErrorListProps> = ({
  errors,
  errorCount,
  isJobError,
}) => {
  return (
    <div
      className="notification-errors-list"
      style={{ maxHeight: "15rem", overflowY: "auto" }}
    >
      <h4>Errors ({errorCount}):</h4>
      <ul>
        {errors.map((error: any, idx: number) => {
          // Job-style error (CSV with row numbers)
          if (isJobError && error.rowNumber) {
            return (
              <li key={idx} className="error-item">
                <strong>Row {error.rowNumber}:</strong>
                {error.errors && Array.isArray(error.errors) ? (
                  <ul className="field-errors">
                    {error.errors.map((fieldError: any, fIdx: number) => (
                      <li key={fIdx}>
                        <span className="field-name">{fieldError.field}:</span>{" "}
                        {fieldError.error}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>
                    {error.error || error.message || "Unknown error"}
                  </span>
                )}
              </li>
            );
          }

          // Simple error (string or object with message)
          return (
            <li key={idx} className="error-item">
              {typeof error === "string"
                ? error
                : error.message || error.error || JSON.stringify(error)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotificationErrorList;
