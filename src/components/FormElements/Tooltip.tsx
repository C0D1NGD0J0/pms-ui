"use client";
import React, { ReactNode, useState, useRef } from "react";

export interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useRef(
    `tooltip-${Math.random().toString(36).substr(2, 9)}`
  );

  const showTooltip = () => {
    if (!disabled && content) {
      setIsVisible(true);
    }
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  if (disabled || !content) {
    return <>{children}</>;
  }

  return (
    <div
      className="custom-tooltip"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            "aria-describedby": isVisible ? tooltipId.current : undefined,
          });
        }
        return child;
      })}

      {isVisible && (
        <div
          id={tooltipId.current}
          role="tooltip"
          className={`custom-tooltip__content custom-tooltip__content__${placement}`}
          aria-hidden={!isVisible}
        >
          <div className="custom-tooltip__text">{content}</div>
          <div
            className={`custom-tooltip__arrow custom-tooltip__arrow__${placement}`}
          />
        </div>
      )}
    </div>
  );
};
