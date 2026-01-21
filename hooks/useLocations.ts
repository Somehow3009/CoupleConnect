import { useState, useEffect } from 'react';
import { Location, Geofence } from '@/types';
import { locationService } from '@/services/locationService';
import { useAuth } from '@/template';

export function useLocations() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    if (user) {
      requestPermissions();
      loadGeofences();
    }
  }, [user]);

  useEffect(() => {
    if (user && permissionGranted) {
      loadLocations();
      startLocationTracking();
    }
  }, [user, permissionGranted]);

  const requestPermissions = async () => {
    const granted = await locationService.requestPermissions();
    setPermissionGranted(granted);
  };

  const loadLocations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await locationService.getFriendLocations(user.id);
      setLocations(data);
    } catch (err) {
      console.error('Failed to load locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadGeofences = async () => {
    if (!user) return;
    
    try {
      const data = await locationService.getGeofences(user.id);
      setGeofences(data);
    } catch (err) {
      console.error('Failed to load geofences:', err);
    }
  };

  const startLocationTracking = async () => {
    if (!user) return;
    
    try {
      const location = await locationService.getCurrentLocation();
      await locationService.updateLocation(
        user.id,
        location.latitude,
        location.longitude,
        location.accuracy
      );
      
      // Refresh friend locations
      loadLocations();
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  const createGeofence = async (
    name: string,
    latitude: number,
    longitude: number,
    radius: number
  ) => {
    if (!user) throw new Error('Not authenticated');
    
    try {
      const geofence = await locationService.createGeofence(
        user.id,
        name,
        latitude,
        longitude,
        radius
      );
      setGeofences(prev => [...prev, geofence]);
      return geofence;
    } catch (err) {
      console.error('Failed to create geofence:', err);
      throw err;
    }
  };

  const deleteGeofence = async (geofenceId: string) => {
    try {
      await locationService.deleteGeofence(geofenceId);
      setGeofences(prev => prev.filter(g => g.id !== geofenceId));
    } catch (err) {
      console.error('Failed to delete geofence:', err);
    }
  };

  const toggleGhostMode = async (enabled: boolean) => {
    if (!user) return;
    
    try {
      await locationService.toggleGhostMode(user.id, enabled);
    } catch (err) {
      console.error('Failed to toggle ghost mode:', err);
      throw err;
    }
  };

  return {
    locations,
    geofences,
    loading,
    permissionGranted,
    refresh: loadLocations,
    createGeofence,
    deleteGeofence,
    toggleGhostMode,
    updateLocation: startLocationTracking,
  };
}
