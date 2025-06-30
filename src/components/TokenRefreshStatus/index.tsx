"use client";

import React from "react";
import { useAuth } from "@store/auth.store";
import { useTokenRefresh } from "@hooks/useTokenRefresh";

interface TokenRefreshStatusProps {
  showDetails?: boolean;
}

export const TokenRefreshStatus: React.FC<TokenRefreshStatusProps> = ({
  showDetails = false,
}) => {
  const { isRefreshingToken, refreshTokenError } = useAuth();
  const { refreshToken, clearTokenRefreshError } = useTokenRefresh();

  const handleManualRefresh = async () => {
    const success = await refreshToken();
    console.log("Manual refresh result:", success);
  };

  if (!showDetails && !isRefreshingToken && !refreshTokenError) {
    return null;
  }

  return (
    <div className="token_refresh_status">
      {isRefreshingToken && (
        <div className="token_refresh_loading">
          <div className="spinner_small">
            <div className="spinner_ring"></div>
          </div>
          <span className="loading_message">Refreshing token...</span>
        </div>
      )}

      {refreshTokenError && (
        <div className="token_refresh_error">
          <div className="error_content">
            <div className="error_details">
              <p className="error_title">Token Refresh Error</p>
              <p className="error_message">{refreshTokenError}</p>
            </div>
            <button
              onClick={clearTokenRefreshError}
              className="error_dismiss"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="token_refresh_actions">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshingToken}
            className={`btn btn-sm btn-outline-secondary ${
              isRefreshingToken ? "btn-disabled" : ""
            }`}
          >
            {isRefreshingToken ? "Refreshing..." : "Test Token Refresh"}
          </button>
        </div>
      )}
    </div>
  );
};
