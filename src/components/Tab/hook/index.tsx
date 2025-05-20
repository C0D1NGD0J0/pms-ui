import { createContext, useContext } from "react";

import { TabsContextType } from "../interface";

export const TabsContext = createContext<TabsContextType | undefined>(
  undefined
);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};
