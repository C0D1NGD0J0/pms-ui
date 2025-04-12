import { useEffect, useState } from "react";

import { TabsContext } from "../hook";
import { TabListProps, TabsProps } from "../interface";

export const TabContainer: React.FC<TabsProps> = ({
  children,
  defaultTab,
  onChange,
  className = "",
  ariaLabel = "Tabs",
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(defaultTab || "");
  const [availableTabs, setAvailableTabs] = useState<{
    [key: string]: boolean;
  }>({});

  // Register tab method for children
  const registerTab = (id: string, disabled: boolean) => {
    setAvailableTabs((prev) => ({ ...prev, [id]: !disabled }));
  };

  // Set first available tab if no default
  useEffect(() => {
    if (!activeTabId && Object.keys(availableTabs).length > 0) {
      // Find first enabled tab
      const firstAvailableTab = Object.entries(availableTabs)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .find(([_, enabled]) => enabled)?.[0];

      if (firstAvailableTab) {
        setActiveTabId(firstAvailableTab);
      }
    }
  }, [availableTabs, activeTabId]);

  // Call onChange when active tab changes
  useEffect(() => {
    if (activeTabId && onChange) {
      console.log(activeTabId, "---tabid");
      onChange(activeTabId);
    }
  }, [activeTabId]);

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
