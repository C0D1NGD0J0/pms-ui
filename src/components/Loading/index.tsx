import React from "react";
import Image from "next/image";

interface LoadingProps {
  description?: string;
  size?: "regular" | "fullscreen";
  onClose?: () => void;
  isCloseable?: boolean;
  showLogo?: boolean;
  textColor?: "light" | "dark";
  customBtn?: React.ReactNode;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "regular",
  description = "Loading",
  onClose,
  isCloseable = false,
  textColor = "dark",
  showLogo = false,
  customBtn,
}) => {
  const containerClasses = [
    "loading_container",
    size === "fullscreen" ? "loading_fullscreen" : "",
  ].join(" ");

  return (
    <div id="loading">
      <div className={containerClasses}>
        <div className={"loading_content"}>
          {showLogo && (
            <div className={"logo_container"}>
              <Image
                src="/assets/imgs/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className={"logo"}
              />
            </div>
          )}

          <div className={"spinner"}>
            <div className={"spinner_ring"}></div>
            <div className={"spinner_ring"}></div>
            <div className={"spinner_ring"}></div>
          </div>

          <div
            className={`message text-fade ${textColor === "light" ? "text-light" : ""}`}
          >
            <h3>{description || "Loading..."}</h3>
          </div>

          {isCloseable && !customBtn && (
            <button
              onClick={onClose}
              className="btn btn-outline-ghost btn-sm btn-rounded"
              style={{ marginTop: "1rem" }}
            >
              Cancel
            </button>
          )}

          {customBtn && customBtn}
        </div>
      </div>
    </div>
  );
};
