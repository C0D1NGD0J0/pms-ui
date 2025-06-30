"use client";

import React from "react";
import { useAuth } from "@store/auth.store";

interface TokenRefreshOverlayProps {
  showOverlay?: boolean;
}

export const TokenRefreshOverlay: React.FC<TokenRefreshOverlayProps> = ({
  showOverlay = true,
}) => {
  const { isRefreshingToken } = useAuth();

  if (!showOverlay || !isRefreshingToken) {
    return null;
  }

  return (
    <div className="token_refresh_overlay">
      <div className="token_refresh_overlay_backdrop">
        <div className="token_refresh_overlay_content">
          <div className="spinner_container">
            <div className="spinner_ring"></div>
            <div className="spinner_ring"></div>
            <div className="spinner_ring"></div>
          </div>
          <div className="refresh_message">
            <h3>Refreshing your session...</h3>
            <p>Please wait a moment while we update your authentication.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
