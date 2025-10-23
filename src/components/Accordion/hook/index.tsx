import { createContext, useContext } from "react";

import { AccordionContextType } from "../interface";

export const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

export const useAccordionContext = (): AccordionContextType => {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error(
      "useAccordionContext must be used within an AccordionContainer"
    );
  }

  return context;
};
