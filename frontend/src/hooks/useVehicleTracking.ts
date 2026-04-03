import { useState, useEffect, useCallback } from 'react';
import { getLatestLocation } from '@/services/api';
import { connectSocket, disconnectSocket, offLocationUpdate, onLocationUpdate } from '@/services/socket';

interface VehicleLocation {
  car_id: string;
  lat: number;
  lng: number;
  speed: number;
  timestamp: string;
}

export const useVehicleTracking = (carId: string = 'car001') => {
  const [location, setLocation] = useState<VehicleLocation>({
    car_id: carId,
    lat: 28.6139,
    lng: 77.2090,
    speed: 0,
    timestamp: new Date().toISOString(),
  });

  const [isMoving, setIsMoving] = useState(true);

  useEffect(() => {
    let isActive = true;
    const normalizedCarId = carId?.trim();

    if (!normalizedCarId) {
      setLocation((prev) => ({ ...prev, car_id: '' }));
      setIsMoving(false);
      return () => {
        isActive = false;
      };
    }

    const loadInitialLocation = async () => {
      try {
        const response = await getLatestLocation(normalizedCarId);
        const latestLocation = response.data?.location;

        if (isActive && latestLocation?.lat !== undefined && latestLocation?.lng !== undefined) {
          const initialLocation = {
            car_id: response.data?.vehicle?.deviceId || normalizedCarId,
            lat: latestLocation.lat,
            lng: latestLocation.lng,
            speed: latestLocation.speed ?? 0,
            timestamp: latestLocation.timestamp || new Date().toISOString(),
          };

          setLocation(initialLocation);
          setIsMoving(initialLocation.speed > 5);
        }
      } catch {
        if (isActive) {
          setLocation(prev => ({ ...prev, car_id: normalizedCarId }));
        }
      }
    };

    connectSocket();

    const handleLocationUpdate = (newLocation: VehicleLocation) => {
      if (newLocation.car_id !== normalizedCarId) {
        return;
      }

      setLocation(newLocation);
      setIsMoving(newLocation.speed > 5);
    };

    onLocationUpdate(handleLocationUpdate);
    loadInitialLocation();

    return () => {
      isActive = false;
      offLocationUpdate();
      disconnectSocket();
    };
  }, [carId]);

  const toggleSimulation = useCallback(() => {
    setIsMoving(prev => !prev);
  }, []);

  return { location, isMoving, toggleSimulation };
};
