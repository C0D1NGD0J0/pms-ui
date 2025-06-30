/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScrollToTop } from "@hooks/useScrollToTop";

import { TabsContext } from "../hook";
import { TabListProps, TabsProps } from "../interface";

const validTabs = [
  "basic",
  "amenities",
  "documents",
  "financial",
  "units",
  "info",
  "maintenance",
  "payments",
];
export const TabContainer: React.FC<TabsProps> = ({
  children,
  defaultTab,
  onChange,
  className = "",
  mode = "new",
  ariaLabel = "Tabs",
  scrollOnChange = true,
}) => {
  const { scrollToTop } = useScrollToTop();
  const searchParams = useSearchParams();
  const activeTabFromParams = searchParams.get("activeTab");
  const [availableTabs, setAvailableTabs] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (mode === "edit" && typeof window !== "undefined") {
      const saved = activeTabFromParams || localStorage.getItem("activeTab");
      if (validTabs.includes(saved || "")) {
        return saved || "";
      }
    }
    return defaultTab || "";
  });

  useEffect(() => {
    if (!activeTabId && Object.keys(availableTabs).length > 0) {
      const firstAvailableTab = Object.entries(availableTabs)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .find(([_, enabled]) => enabled)?.[0];

      if (firstAvailableTab) {
        setActiveTabId(firstAvailableTab);
      }
    }
  }, [availableTabs, activeTabId]);

  useEffect(() => {
    if (activeTabId) {
      if (onChange) {
        onChange(activeTabId);
        localStorage.setItem("activeTab", activeTabId);
      }

      if (scrollOnChange) {
        scrollToTop(null);
      }
    }
  }, [activeTabId, onChange, scrollOnChange]);

  const registerTab = (id: string, disabled: boolean) => {
    setAvailableTabs((prev) => ({ ...prev, [id]: !disabled }));
  };

  return (
    <TabsContext.Provider value={{ activeTabId, setActiveTabId, registerTab }}>
      <div
        className={`tabs-container ${className}`}
        role="tablist"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({
  children,
  className = "",
}) => {
  return <ul className={`settings-tabs ${className}`}>{children}</ul>;
};
