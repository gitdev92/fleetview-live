import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getTripsByVehicle } from '../controllers/tripController.js';

const router = Router();

router.get('/trips/:carId', authMiddleware, getTripsByVehicle);

export default router;
