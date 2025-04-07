"use client";

import React, { useState } from "react";
import { useAuth } from "@store/hooks/useAuth";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { Loading } from "@components/Loading";

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth();
  const { refreshUser, isFetchingUser } = useCurrentUser();
  const [showLoading, setShowLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<"regular" | "fullscreen">("regular");
  const [showLogo, setShowLogo] = useState(false);

  // Demo function to show loading for a few seconds
  const demoLoading = (type: "regular" | "fullscreen", withLogo: boolean) => {
    setLoadingType(type);
    setShowLogo(withLogo);
    setShowLoading(true);
    setTimeout(() => setShowLoading(false), 3000);
  };

  if (isFetchingUser) {
    return <Loading description="Loading dashboard data..." />;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Dashboard</h1>
      
      {user && (
        <div style={{ marginBottom: "2rem" }}>
          <h2>Welcome, {user?.fullname || user?.displayName}</h2>
          <p>Email: {user?.email}</p>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h3>Loading Component Demo</h3>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button 
            onClick={() => demoLoading("regular", false)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Show Regular Loading
          </button>
          
          <button 
            onClick={() => demoLoading("regular", true)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Show Regular Loading with Logo
          </button>
          
          <button 
            onClick={() => demoLoading("fullscreen", false)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Show Fullscreen Loading
          </button>
          
          <button 
            onClick={() => demoLoading("fullscreen", true)}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Show Fullscreen Loading with Logo
          </button>
        </div>
      </div>

      {showLoading && (
        <Loading 
          size={loadingType}
          description="This is a demo loading message..."
          showLogo={showLogo}
          isCloseable={true}
          onClose={() => setShowLoading(false)}
        />
      )}
      
      <button 
        onClick={() => refreshUser()} 
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Refresh User Data
      </button>
    </div>
  );
}