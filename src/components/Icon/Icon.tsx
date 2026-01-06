import React from "react";
import * as AntIcons from "@ant-design/icons";

export type IconVariant = "boxicon" | "antd";

export interface IconProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "color"
> {
  /**
   * Icon name
   * - For boxicon: "bx-user", "bx-check-circle", etc.
   * - For antd: "UserOutlined", "CheckCircleOutlined", etc.
   */
  name: string;

  /**
   * Icon variant/library to use
   * @default "boxicon"
   */
  variant?: IconVariant;

  /**
   * Size of the icon (can be number for pixels or string for any CSS unit)
   * @example 16, 24, "1.5rem", "2em"
   */
  size?: number | string;

  /**
   * Color of the icon (any valid CSS color)
   * @example "#FF0000", "red", "rgb(255,0,0)"
   */
  color?: string;

  /**
   * Whether the icon should spin/rotate continuously
   * @default false
   */
  spin?: boolean;

  /**
   * Rotation angle in degrees
   * @example 90, 180, 270
   */
  rotate?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  variant = "boxicon",
  size,
  color,
  spin = false,
  rotate,
  className = "",
  style = {},
  ...rest
}) => {
  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(size && { fontSize: typeof size === "number" ? `${size}px` : size }),
    ...(color && { color }),
    ...(rotate &&
      variant === "boxicon" && { transform: `rotate(${rotate}deg)` }),
  };

  if (variant === "antd") {
    const AntIconComponent = (AntIcons as any)[name];
    if (!AntIconComponent) {
      return null;
    }

    return (
      <AntIconComponent
        style={combinedStyle}
        spin={spin}
        rotate={rotate}
        className={className}
        {...rest}
      />
    );
  }

  const boxiconClasses = [
    "bx",
    name,
    spin && "bx-spin",
    rotate && "bx-rotate",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <i className={boxiconClasses} style={combinedStyle} {...rest} />;
};

Icon.displayName = "Icon";

export default Icon;
