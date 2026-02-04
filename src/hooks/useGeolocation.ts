import { useState } from "react";

interface GeolocationResult {
  city: string;
  state: string;
  country: string;
  countryCode: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

interface UseGeolocationReturn {
  detectLocation: () => Promise<string>;
  isDetecting: boolean;
  error: string | null;
}

export function useGeolocation(): UseGeolocationReturn {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = async (): Promise<string> => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setIsDetecting(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data: GeolocationResult = await response.json();

            const city = data.city || data.locality || "";
            const state = data.state || data.principalSubdivision || "";
            const country = data.country || data.countryName || "";
            const countryCode = data.countryCode || "";

            let location = "";
            if (countryCode === "US" || countryCode === "CA") {
              location = state
                ? `${city}, ${state} ${country}`
                : `${city}, ${country}`;
            } else {
              location = state
                ? `${city}, ${state}, ${country}`
                : `${city}, ${country}`;
            }

            setIsDetecting(false);
            resolve(location);
          } catch {
            const errorMsg = "Could not detect location. Please try again.";
            setError(errorMsg);
            setIsDetecting(false);
            reject(new Error(errorMsg));
          }
        },
        () => {
          const errorMsg = "Location access denied. Please enter manually.";
          setError(errorMsg);
          setIsDetecting(false);
          reject(new Error(errorMsg));
        }
      );
    });
  };

  return {
    detectLocation,
    isDetecting,
    error,
  };
}
