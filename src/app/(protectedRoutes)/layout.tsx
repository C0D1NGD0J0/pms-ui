"use client";
import React from "react";
import { MainContent, Sidebar, Navbar, Footer } from "@components/Layouts";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid-container">
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
