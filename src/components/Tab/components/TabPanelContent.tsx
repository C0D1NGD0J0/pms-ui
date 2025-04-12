import { useTabsContext } from "../hook";
import { TabPanelProps } from "../interface";

export const TabPanelContent: React.FC<TabPanelProps> = ({
  id,
  children,
  className = "",
}) => {
  const { activeTabId } = useTabsContext();
  const isActive = activeTabId === id;

  return (
    <div
      id={`${id}-tab`}
      className={`panel-content tab-content ${
        isActive ? "active" : ""
      } ${className}`}
      role="tabpanel"
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
    >
      {children}
    </div>
  );
};
