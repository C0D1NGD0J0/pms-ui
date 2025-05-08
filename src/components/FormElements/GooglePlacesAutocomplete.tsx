"use client";

import type { ChangeEvent, FocusEvent } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import React, { useCallback, forwardRef, useEffect, useRef } from "react";

import { FormInput } from "./FormInput";

// Define the structure for address components
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

// Define the place result structure (partial, include what we need)
interface PlaceResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id: string;
}

interface GooglePlacesAutocompleteProps {
  id?: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onPlaceSelected?: (place: PlaceResult) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hasError?: boolean;
  autoComplete?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export function getComponentValue(
  components: AddressComponent[],
  type: string
): string {
  const component = components.find((c) => c.types.includes(type));
  return component ? component.long_name : "";
}

export const GooglePlacesAutocomplete = forwardRef<
  HTMLInputElement,
  GooglePlacesAutocompleteProps
>(
  (
    {
      id,
      name,
      value,
      onChange,
      onBlur,
      onPlaceSelected,
      placeholder = " ",
      className = "",
      required = false,
      disabled = false,
      readOnly = false,
      hasError = false,
      autoComplete,
      ariaLabel,
      ariaDescribedBy,
      ...rest
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLInputElement>(null);
    const handlePlaceSelected = useCallback(
      (place: PlaceResult) => {
        if (!place || !place.address_components) return;

        if (onPlaceSelected) {
          onPlaceSelected(place);
        }

        if (localRef.current) {
          const syntheticEvent = {
            target: {
              name: name,
              value: place.formatted_address || "",
            },
          } as ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent);
        }
      },
      [onChange, name, onPlaceSelected]
    );

    const { ref: googleRef } = usePlacesWidget<HTMLInputElement>({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      onPlaceSelected: handlePlaceSelected,
      options: {
        types: ["address"],
        fields: [
          "address_components",
          "formatted_address",
          "geometry.location",
          "place_id",
        ],
      },
    });

    useEffect(() => {
      // sync forwardedRef with localRef
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(localRef.current);
        } else {
          forwardedRef.current = localRef.current;
        }
      }

      // sync google's ref with our local ref
      if (localRef.current && googleRef) {
        // googleRef from usePlacesWidget is always going to be a RefObject, not a function
        if (googleRef.current !== localRef.current) {
          googleRef.current = localRef.current;
        }
      }
    }, [forwardedRef, googleRef]);

    return (
      <div className="google-places-autocomplete-wrapper">
        <FormInput
          ref={localRef}
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={className}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          hasError={hasError}
          autoComplete={autoComplete}
          ariaLabel={ariaLabel}
          ariaDescribedBy={ariaDescribedBy}
          {...rest}
        />
      </div>
    );
  }
);

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
