import React, { ReactNode, FormEvent, CSSProperties } from "react";

type FormVariant = "auth" | "basic" | "custom";

export interface FormContextValue<T = unknown> {
  formState?: T;
  errors?: Record<string, unknown>;
  setValue?: (field: string, value: unknown) => void;
  register?: (field: string) => unknown;
  [key: string]: unknown;
}

export const FormContext = React.createContext<FormContextValue | undefined>(
  undefined
);

interface FormProps {
  children: ReactNode;
  id?: string;
  encType?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement> | unknown) => void;
  className?: string;
  noValidate?: boolean;
  style?: CSSProperties;
  variant?: FormVariant;
  autoComplete?: string;
  formContext?: FormContextValue;
}

export const Form: React.FC<FormProps> = ({
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
