import storage from "@utils/storage";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useScrollToTop } from "@hooks/useScrollToTop";

import { TabsContext } from "../hook";
import { TabListItem } from "./TabListItem";
import { TabPanelContent } from "./TabPanelContent";
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
  tabItems,
  defaultTab,
  onChange,
  className = "",
  mode = "new",
  ariaLabel = "Tabs",
  scrollOnChange = true,
  variant = "settings",
}) => {
  const { scrollToTop } = useScrollToTop();
  const searchParams = useSearchParams();
  const activeTabFromParams = searchParams.get("activeTab");
  const [availableTabs, setAvailableTabs] = useState<{
    [key: string]: boolean;
  }>({});

  // Get available tab IDs from tabItems if provided
  const getValidTabs = () => {
    if (tabItems) {
      return tabItems.filter((item) => !item.isHidden).map((item) => item.id);
    }
    return validTabs;
  };

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const currentValidTabs = getValidTabs();
    if (mode === "edit") {
      const saved =
        activeTabFromParams || storage.get<string>("activeTab", "local");
      if (saved && currentValidTabs.includes(saved)) {
        return saved;
      }
    }
    return defaultTab || currentValidTabs[0] || "";
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
        storage.set("activeTab", activeTabId, "local");
      }

      if (scrollOnChange) {
        scrollToTop(null);
      }
    }
  }, [activeTabId, onChange, scrollOnChange]);

  const registerTab = (id: string, disabled: boolean) => {
    setAvailableTabs((prev) => ({ ...prev, [id]: !disabled }));
  };

  // Get active tab content when using tabItems
  const activeTabItem = tabItems
    ?.filter((item) => !item.isHidden)
    .find((item) => item.id === activeTabId);

  return (
    <TabsContext.Provider value={{ activeTabId, setActiveTabId, registerTab }}>
      <div
        className={`tabs-container tabs-container-${variant} ${className}`}
        role="tablist"
        aria-label={ariaLabel}
      >
        {tabItems ? (
          <>
            <TabList variant={variant}>
              {tabItems
                .filter((item) => !item.isHidden)
                .map((item) => (
                  <TabListItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    hasError={item.hasError}
                    disabled={item.disabled}
                  />
                ))}
            </TabList>

            {activeTabItem && (
              <TabPanelContent key={activeTabItem.id} id={activeTabItem.id}>
                {activeTabItem.content}
              </TabPanelContent>
            )}
          </>
        ) : (
          // Legacy pattern: Manual children (backward compatibility)
          children
        )}
      </div>
    </TabsContext.Provider>
  );
};

export const TabList: React.FC<TabListProps> = ({
  children,
  className = "",
  variant = "settings",
}) => {
  const tabsClass = variant === "profile" ? "profile-tabs" : "settings-tabs";
  return <ul className={`${tabsClass} ${className}`}>{children}</ul>;
};
