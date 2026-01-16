import { useState, useEffect } from 'react';
import { Location } from '@/types';
import { locationService } from '@/services/locationService';

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
    
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      loadLocations();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadLocations = async () => {
    try {
      const data = await locationService.getAllLocations();
      setLocations(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load locations:', err);
      setLoading(false);
    }
  };

  return {
    locations,
    loading,
    refresh: loadLocations,
  };
}
