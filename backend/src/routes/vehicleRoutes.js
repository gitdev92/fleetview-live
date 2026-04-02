import { Router } from 'express';
import { createVehicle, getVehicleLocation, getVehicles } from '../controllers/vehicleController.js';

const router = Router();

router.post('/vehicles', createVehicle);
router.get('/vehicles', getVehicles);
router.get('/vehicles/:deviceId/location', getVehicleLocation);

export default router;