"use client";
import React from "react";
import { TokenRefreshStatus } from "@components/TokenRefreshStatus";
import { MainContent, Sidebar, Navbar, Footer } from "@components/Layouts";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid-container">
      <TokenRefreshStatus showDetails={true} />
      <Navbar />
      <main className="main">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
