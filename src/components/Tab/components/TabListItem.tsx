import { useEffect } from "react";

import { TabList } from "./TabContainer";
import { useTabsContext } from "../hook";
import { TabPanelContent } from "./TabPanelContent";
import { TabListItemProps, TabItem } from "../interface";

export const TabListItem: React.FC<TabListItemProps> = ({
  id,
  label,
  disabled = false,
  className = "",
}) => {
  const { activeTabId, setActiveTabId, registerTab } = useTabsContext();

  // Register this tab with parent on mount
  // useEffect(() => {
  //   registerTab(id, disabled);
  // }, [id, disabled, registerTab]);

  const isActive = activeTabId === id;

  const handleClick = () => {
    if (!disabled) {
      setActiveTabId(id);
    }
  };

  return (
    <li
      className={`settings-tab ${isActive ? "active" : ""} ${
        disabled ? "disabled" : ""
      } ${className}`}
      onClick={handleClick}
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-disabled={disabled}
      aria-controls={`${id}-tab`}
      tabIndex={isActive ? 0 : -1}
      data-tab={id}
    >
      {label}
    </li>
  );
};

export const createTabsFromItems = (items: TabItem[]) => {
  return (
    <>
      <TabList>
        {items.map((item) => (
          <TabListItem
            key={`tab-${item.id}`}
            id={item.id}
            label={item.label}
            disabled={item.disabled}
          />
        ))}
      </TabList>
      {items.map((item) => (
        <TabPanelContent key={`panel-${item.id}`} id={item.id}>
          {item.content}
        </TabPanelContent>
      ))}
    </>
  );
};
