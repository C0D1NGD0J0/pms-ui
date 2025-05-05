/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useScrollToTop } from "@hooks/useScrollToTop";

import { TabsContext } from "../hook";
import { TabListProps, TabsProps } from "../interface";

export const TabContainer: React.FC<TabsProps> = ({
  children,
  defaultTab,
  onChange,
  className = "",
  ariaLabel = "Tabs",
  scrollOnChange = true, // New prop to optionally disable auto-scrolling
}) => {
  const { scrollToTop } = useScrollToTop();
  const [activeTabId, setActiveTabId] = useState<string>(defaultTab || "");
  const [availableTabs, setAvailableTabs] = useState<{
    [key: string]: boolean;
  }>({});

  const registerTab = (id: string, disabled: boolean) => {
    setAvailableTabs((prev) => ({ ...prev, [id]: !disabled }));
  };

  // init activetab if none is set
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

  // to update activeTabId if defaultTab changes
  useEffect(() => {
    if (defaultTab && defaultTab !== activeTabId) {
      setActiveTabId(defaultTab);
    }
  }, [defaultTab]);

  // Call onChange when active tab changes
  useEffect(() => {
    if (activeTabId) {
      if (onChange) {
        onChange(activeTabId);
      }

      if (scrollOnChange) {
        scrollToTop(null);
      }
    }
  }, [activeTabId, onChange, scrollOnChange]);

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
