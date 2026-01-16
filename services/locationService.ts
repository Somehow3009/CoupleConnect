import { Location, Geofence } from '@/types';
import { mockLocations } from './mockData';

class LocationService {
  private locations: Record<string, Location> = {};
  private geofences: Geofence[] = [];

  constructor() {
    // Initialize with mock data
    mockLocations.forEach(loc => {
      this.locations[loc.userId] = loc;
    });
  }

  async getLocation(userId: string): Promise<Location | null> {
    return this.locations[userId] || null;
  }

  async getAllLocations(): Promise<Location[]> {
    return Object.values(this.locations);
  }

  async updateLocation(
    userId: string,
    latitude: number,
    longitude: number,
    accuracy?: number
  ): Promise<Location> {
    const location: Location = {
      userId,
      latitude,
      longitude,
      timestamp: new Date(),
      accuracy,
    };

    this.locations[userId] = location;
    return location;
  }

  async getGeofences(userId: string): Promise<Geofence[]> {
    return this.geofences.filter(g => g.userId === userId);
  }

  async createGeofence(
    name: string,
    latitude: number,
    longitude: number,
    radius: number,
    userId: string
  ): Promise<Geofence> {
    const geofence: Geofence = {
      id: `geofence-${Date.now()}`,
      name,
      latitude,
      longitude,
      radius,
      userId,
      enabled: true,
    };

    this.geofences.push(geofence);
    return geofence;
  }

  async deleteGeofence(geofenceId: string): Promise<void> {
    this.geofences = this.geofences.filter(g => g.id !== geofenceId);
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

  // Mock GPS simulation for demo
  simulateLocationUpdate(userId: string): void {
    const current = this.locations[userId];
    if (!current) return;

    // Random small movement (±0.001 degrees ≈ 100m)
    const newLat = current.latitude + (Math.random() - 0.5) * 0.001;
    const newLon = current.longitude + (Math.random() - 0.5) * 0.001;

    this.updateLocation(userId, newLat, newLon, 10);
  }
}

export const locationService = new LocationService();
