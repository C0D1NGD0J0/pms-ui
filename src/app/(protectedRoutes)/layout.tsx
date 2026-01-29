"use client";
import React from "react";
import { GlobalBanners } from "@components/GlobalBanners";
import { EntitlementsProvider } from "@hooks/contexts/index";
import { MainContent, Sidebar, Navbar, Footer } from "@components/Layouts";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntitlementsProvider>
      <div className="grid-container">
        <div className="global-banner-container">
          <GlobalBanners />
        </div>
        <Navbar />
        <main className="main">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </main>
        <Footer />
      </div>
    </EntitlementsProvider>
  );
};

export default DashboardLayout;
