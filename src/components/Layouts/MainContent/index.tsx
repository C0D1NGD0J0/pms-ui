import React from "react";

export function MainContent({ children }: { children: React.ReactNode }) {
  return <section className="main-content">{children}</section>;
}
