import React from "react";

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <section className="main-content">
      <div className="page admin-dashboard">{children}</div>
    </section>
  );
}
