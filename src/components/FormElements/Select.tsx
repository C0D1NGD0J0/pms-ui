"use client";
import React, {
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from "react";

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

// Interface for the new modern select functionality
interface ModernSelectProps extends Omit<SelectProps, "onChange"> {
  onChange: (value: string) => void;
}

// Check if onChange expects a value string (modern) or event (legacy)
function isModernOnChange(onChange: any): onChange is (value: string) => void {
  return onChange.length === 1;
}

export const Select = forwardRef<
  HTMLButtonElement,
  SelectProps | ModernSelectProps
>((props, ref) => {
  const {
    id,
    name,
    options,
    value,
    onChange,
    onBlur,
    className = "",
    placeholder = "Select an option",
    required = false,
    disabled = false,
    ariaLabel,
    ariaDescribedBy,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isTouched, setIsTouched] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Find selected option
  const selectedOption = options.find((option) => option.value === value);
  const selectedLabel = selectedOption?.label || placeholder;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (isModernOnChange(onChange)) {
        onChange(newValue);
      } else {
        const syntheticEvent = {
          target: { value: newValue, name },
          currentTarget: { value: newValue, name },
        } as ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    },
    [onChange, name]
  );

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else if (focusedIndex >= 0) {
            const selectedOption = options[focusedIndex];
            if (selectedOption && !selectedOption.disabled) {
              handleValueChange(selectedOption.value);
              setIsOpen(false);
              setFocusedIndex(-1);
              triggerRef.current?.focus();
            }
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            const nextIndex = Math.min(focusedIndex + 1, options.length - 1);
            setFocusedIndex(nextIndex);
          }
          break;

        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            const prevIndex = Math.max(focusedIndex - 1, 0);
            setFocusedIndex(prevIndex);
          }
          break;

        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;

        case "Tab":
          setIsOpen(false);
          setFocusedIndex(-1);
          break;

        default:
          if (e.key.length === 1 && isOpen) {
            const typedChar = e.key.toLowerCase();
            const matchingIndex = options.findIndex(
              (option, index) =>
                index > focusedIndex &&
                option.label.toLowerCase().startsWith(typedChar) &&
                !option.disabled
            );

            if (matchingIndex >= 0) {
              setFocusedIndex(matchingIndex);
            }
          }
          break;
      }
    },
    [isOpen, focusedIndex, options, handleValueChange, disabled]
  );

  // Handle option click
  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;

    handleValueChange(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    triggerRef.current?.focus();
  };

  // Handle trigger click
  const handleTriggerClick = () => {
    if (disabled) return;

    setIsOpen(!isOpen);
    setFocusedIndex(isOpen ? -1 : 0);
  };

  // Handle blur
  const handleBlur = () => {
    setIsTouched(true);
    if (onBlur) {
      // Create synthetic event for legacy compatibility
      const syntheticEvent = {
        target: { value, name },
        currentTarget: { value, name },
      } as FocusEvent<HTMLSelectElement>;
      onBlur(syntheticEvent);
    }
  };

  // Focus management for options
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex, isOpen]);

  const selectClasses = [
    "custom-select-wrapper",
    isTouched ? "touched" : "untouched",
    isOpen ? "open" : "closed",
    disabled ? "disabled" : "",
    value ? "has-value" : "no-value",
    required && !value && isTouched ? "invalid" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={selectClasses}>
      <button
        ref={(el) => {
          triggerRef.current = el;
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        id={id}
        type="button"
        className="select-trigger"
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={ariaLabel ? undefined : `${id}-label`}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      >
        <span className="select-value">{selectedLabel}</span>
        <span className="select-arrow" aria-hidden="true">
          {disabled ? (
            <i className="bx bx-lock-alt"></i>
          ) : (
            <i
              className={`bx ${isOpen ? "bx-chevron-up" : "bx-chevron-down"}`}
            ></i>
          )}
        </span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="select-options"
          role="listbox"
          aria-labelledby={`${id}-label`}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              className={`select-option ${
                index === focusedIndex ? "focused" : ""
              } ${option.value === value ? "selected" : ""} ${
                option.disabled ? "disabled" : ""
              }`}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} required={required} />
    </div>
  );
});

Select.displayName = "Select";
