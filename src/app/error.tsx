"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router Error Component
 *
 * This is the modern approach to error handling in Next.js App Router.
 * Place this file in a route segment to catch errors in that segment and its children.
 *
 * error.tsx must be a Client Component.
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by Next.js error handler:", error);
  }, [error]);

  return (
    <div className="error-container">
      <div className="error-content">
        <h2>Something went wrong!</h2>
        <p>{error.message || "An unexpected error occurred"}</p>
        <button onClick={reset} className="btn">
          Try again
        </button>
      </div>
    </div>
  );
}
