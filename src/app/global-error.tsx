"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global Error Component for Next.js App Router
 *
 * This component catches errors in the root layout.
 * It completely replaces the root layout when active,
 * so it must include its own <html> and <body> tags.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="global-error-container">
          <div className="global-error-content">
            <h1>Something went terribly wrong!</h1>
            <p>A critical error has occurred in the application.</p>
            {error.message && (
              <div className="error-message">
                <p>{error.message}</p>
                {error.digest && <p>Error ID: {error.digest}</p>}
              </div>
            )}
            <button onClick={reset} className="btn">
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
