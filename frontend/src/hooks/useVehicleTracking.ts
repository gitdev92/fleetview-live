import { useState, useEffect, useCallback } from 'react';
import { getSimulatedLocation } from '@/services/mockData';

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
    const interval = setInterval(() => {
      const newLocation = getSimulatedLocation();
      setLocation(newLocation);
      setIsMoving(newLocation.speed > 5);
    }, 2000);

    return () => clearInterval(interval);
  }, [carId]);

  const toggleSimulation = useCallback(() => {
    setIsMoving(prev => !prev);
  }, []);

  return { location, isMoving, toggleSimulation };
};
