import React, { ReactNode, FormEvent, CSSProperties } from "react";

type FormVariant = "auth" | "basic" | "custom";

export interface FormContextValue<T = unknown> {
  formState?: T;
  errors?: Record<string, unknown>;
  setValue?: (field: string, value: unknown) => void;
  register?: (field: string) => unknown;
  [key: string]: unknown;
}

export const FormContext = React.createContext<unknown | undefined>(undefined);

interface FormProps<T> {
  children: ReactNode;
  id?: string;
  encType?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement> | unknown) => void;
  className?: string;
  noValidate?: boolean;
  style?: CSSProperties;
  variant?: FormVariant;
  autoComplete?: string;
  formContext?: T;
}

export const Form: React.FC<FormProps<unknown>> = ({
  children,
  onSubmit,
  id,
  encType,
  className,
  style,
  variant,
  formContext,
  noValidate = false,
  autoComplete = "false",
}) => {
  const variantClass = variant ? `${variant}-form` : "";
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(event);
    }
  };

  return (
    <FormContext.Provider value={formContext || {}}>
      <form
        encType={encType}
        className={`${variantClass} ${className || ""}`}
        style={style}
        onSubmit={handleSubmit}
        id={id}
        noValidate={noValidate}
        autoComplete={autoComplete}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export function useFormContext<T = unknown>(): T {
  const context = React.useContext(FormContext);
  return (context || {}) as T;
}
