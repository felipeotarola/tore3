import { useEffect, useState } from 'react';

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState<string>('--:--');
  const [currentLocation, setCurrentLocation] = useState<string>('');

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Get location based on timezone
    const getLocation = () => {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Extract city name from timezone (e.g., "America/New_York" -> "New York")
        const cityName =
          timeZone.split('/').pop()?.replace(/_/g, ' ') || timeZone;
        setCurrentLocation(cityName);
      } catch {
        setCurrentLocation('Unknown');
      }
    };

    getLocation();

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return { currentTime, currentLocation };
};
