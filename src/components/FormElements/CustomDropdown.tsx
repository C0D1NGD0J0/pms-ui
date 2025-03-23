"use client";
import React, {
  KeyboardEvent,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from "react";

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

interface CustomDropdownProps {
  id: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  errorMsg?: string | React.ReactNode;
  ariaDescribedBy?: string;
}

export const CustomDropdown = forwardRef<HTMLDivElement, CustomDropdownProps>(
  (
    {
      id,
      options,
      value,
      onChange,
      onBlur,
      placeholder = "Select an option",
      required = false,
      disabled = false,
      className = "",
      ariaLabel,
      errorMsg = false,
      ariaDescribedBy,
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find the selected option
    const selectedOption =
      options.find((option) => option.value === value) || null;

    // Toggle dropdown
    const toggleDropdown = (e: React.MouseEvent) => {
      if (!disabled) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
      }
    };

    // Handle outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle option selection
    const handleOptionSelect = (
      option: DropdownOption,
      e: React.MouseEvent<HTMLLIElement>
    ) => {
      e.stopPropagation();
      if (!option.disabled) {
        onChange(option.value);
        setIsOpen(false);
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0)
            handleOptionSelect(options[highlightedIndex], e as any);
          else toggleDropdown(e as any);
          break;
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prevIndex) => (prevIndex + 1) % options.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex(
            (prevIndex) => (prevIndex - 1 + options.length) % options.length
          );
          break;
        case "Tab":
          setIsOpen(false);
          break;
      }
    };

    const handleArrowClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        setIsOpen((prev) => !prev);
      }
    };

    // Reset highlighted index when opening dropdown
    useEffect(() => {
      if (isOpen) {
        const selectedIndex = options.findIndex(
          (option) => option.value === value
        );
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }, [isOpen, options, value]);

    return (
      <div
        ref={dropdownRef}
        id={id}
        className={`custom-dropdown ${isOpen ? "active" : ""} ${
          disabled ? "disabled" : ""
        } ${className}`}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={toggleDropdown}
        onBlur={onBlur}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={required}
        aria-disabled={disabled}
        style={{ border: `${errorMsg ? "1px solid red" : ""}` }}
      >
        <div className="selected-option">
          <span className="selected-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="selected-chevron" onClick={handleArrowClick}>
            <i
              className={`bx ${isOpen ? "bxs-chevron-up" : "bxs-chevron-down"}`}
            ></i>
          </span>
        </div>

        {isOpen && (
          <ul
            id={`${id}-options`}
            className="options-list"
            role="listbox"
            style={{ display: `${isOpen ? "block" : "none"}` }}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                className={`option-item ${option.disabled ? "disabled" : ""} ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={(e) => handleOptionSelect(option, e)}
                role="option"
                aria-selected={option.value === value}
                aria-disabled={option.disabled}
                tabIndex={-1}
              >
                {option.icon && (
                  <i className={`bx ${option.icon} option-icon`}></i>
                )}
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

CustomDropdown.displayName = "CustomDropdown";
