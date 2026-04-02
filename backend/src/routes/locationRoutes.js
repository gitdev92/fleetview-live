import { Router } from 'express';
import { updateLocation } from '../controllers/locationController.js';

const router = Router();

router.post('/location/update', updateLocation);

export default router;