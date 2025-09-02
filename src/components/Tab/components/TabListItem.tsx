import { TabList } from "./TabContainer";
import { useTabsContext } from "../hook";
import { TabPanelContent } from "./TabPanelContent";
import { TabListItemProps, TabItem } from "../interface";

export const TabListItem: React.FC<TabListItemProps> = ({
  id,
  label,
  className = "",
  disabled = false,
  hasError = false,
  icon,
}) => {
  const { activeTabId, setActiveTabId } = useTabsContext();
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
      } ${hasError && hasError ? "has-error" : ""} ${className}`}
      onClick={handleClick}
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-disabled={disabled}
      aria-controls={`${id}-tab`}
      tabIndex={isActive ? 0 : -1}
      data-tab={id}
    >
      {icon && <span className="tab-icon">{icon}</span>}
      <span className="tab-label">{label}</span>
      {hasError && (
        <span
          className="error-indicator"
          aria-label="This tab has errors"
        ></span>
      )}
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
            hasError={item.hasError}
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
