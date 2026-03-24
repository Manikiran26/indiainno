import { useState, useEffect } from "react";

/**
 * Custom hook to track real-time user location
 * @returns {object} { location: { lat, lng }, error: string | null }
 */
export default function useUserLocation(enabled = true) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) {
      if (!navigator.geolocation) setError("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lng: longitude
        });
        console.log("GPS Location:", latitude, longitude);
        console.log("User Location State:", { lat: latitude, lng: longitude });
        setError(null);
      },
      (err) => {
        console.error("Location error:", err);
        console.log("Using fallback location: Delhi");
        // Fallback to Delhi (IMPORTANT for demo)
        const fallback = {
          lat: 28.6139,
          lng: 77.2090
        };
        setLocation(fallback);
        console.log("User Location State:", fallback);
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Cleanup on unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return { location, error };
}
