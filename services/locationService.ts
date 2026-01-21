import { getSupabaseClient } from '@/template';
import { Location, Geofence } from '@/types';
import * as ExpoLocation from 'expo-location';

class LocationService {
  private supabase = getSupabaseClient();

  async requestPermissions(): Promise<boolean> {
    const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy: number }> {
    const location = await ExpoLocation.getCurrentPositionAsync({
      accuracy: ExpoLocation.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
    };
  }

  async updateLocation(userId: string, latitude: number, longitude: number, accuracy?: number): Promise<void> {
    // Get user's ghost mode status
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('ghost_mode')
      .eq('id', userId)
      .single();

    const { error } = await this.supabase
      .from('locations')
      .insert({
        user_id: userId,
        latitude,
        longitude,
        accuracy,
        is_ghost_mode: profile?.ghost_mode || false,
      });

    if (error) throw error;
  }

  async getFriendLocations(userId: string): Promise<Location[]> {
    // Get user's friends
    const { data: relationships } = await this.supabase
      .from('relationships')
      .select('related_user_id')
      .eq('user_id', userId);

    if (!relationships || relationships.length === 0) return [];

    const friendIds = relationships.map(r => r.related_user_id);

    // Get latest location for each friend (not in ghost mode)
    const locations: Location[] = [];
    
    for (const friendId of friendIds) {
      const { data } = await this.supabase
        .from('locations')
        .select('*')
        .eq('user_id', friendId)
        .eq('is_ghost_mode', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        locations.push({
          userId: data.user_id,
          latitude: data.latitude,
          longitude: data.longitude,
          timestamp: new Date(data.created_at),
          accuracy: data.accuracy,
          address: data.address,
        });
      }
    }

    return locations;
  }

  async getGeofences(userId: string): Promise<Geofence[]> {
    const { data, error } = await this.supabase
      .from('geofences')
      .select('*')
      .eq('user_id', userId)
      .eq('enabled', true);

    if (error) throw error;

    return (data || []).map(g => ({
      id: g.id,
      name: g.name,
      latitude: g.latitude,
      longitude: g.longitude,
      radius: g.radius,
      userId: g.user_id,
      enabled: g.enabled,
    }));
  }

  async createGeofence(
    userId: string,
    name: string,
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Geofence> {
    const { data, error } = await this.supabase
      .from('geofences')
      .insert({
        user_id: userId,
        name,
        latitude,
        longitude,
        radius,
        enabled: true,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      radius: data.radius,
      userId: data.user_id,
      enabled: data.enabled,
    };
  }

  async deleteGeofence(geofenceId: string): Promise<void> {
    const { error } = await this.supabase
      .from('geofences')
      .delete()
      .eq('id', geofenceId);

    if (error) throw error;
  }

  async toggleGhostMode(userId: string, enabled: boolean): Promise<void> {
    const { error } = await this.supabase
      .from('user_profiles')
      .update({ ghost_mode: enabled })
      .eq('id', userId);

    if (error) throw error;
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    // Haversine formula
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  checkGeofence(
    userLat: number,
    userLon: number,
    geofence: Geofence
  ): boolean {
    const distance = this.calculateDistance(
      userLat,
      userLon,
      geofence.latitude,
      geofence.longitude
    );
    return distance <= geofence.radius;
  }
}

export const locationService = new LocationService();
