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
  const { currentLoadingState } = useAuth();
  const { isRefreshingToken, refreshToken } = useTokenRefresh();
  // Since refreshTokenError is not defined in either hook, we'll need to handle it differently
  const [refreshTokenError, setRefreshTokenError] = React.useState<
    string | null
  >(null);

  const clearTokenRefreshError = () => setRefreshTokenError(null);

  const handleManualRefresh = async () => {
    const success = await refreshToken();
    console.log("Manual refresh result:", success);
  };

  const isRefreshing =
    isRefreshingToken || currentLoadingState === "refreshing_token";

  if (!showDetails && !isRefreshing && !refreshTokenError) {
    return null;
  }

  return (
    <div className="token_refresh_status">
      {isRefreshing && (
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
            disabled={isRefreshing}
            className={`btn btn-sm btn-outline-secondary ${
              isRefreshing ? "btn-disabled" : ""
            }`}
          >
            {isRefreshing ? "Refreshing..." : "Test Token Refresh"}
          </button>
        </div>
      )}
    </div>
  );
};
