import { Router } from 'express';
import { createVehicle, getVehicleLocation, getVehicles } from '../controllers/vehicleController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/vehicles', authMiddleware, createVehicle);
router.get('/vehicles', authMiddleware, getVehicles);
router.get('/vehicles/:deviceId/location', getVehicleLocation);

export default router;