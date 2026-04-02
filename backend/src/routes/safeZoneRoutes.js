import { Router } from 'express';
import { createSafeZone, deleteSafeZone, getSafeZones } from '../controllers/safeZoneController.js';

const router = Router();

router.post('/safe-zones', createSafeZone);
router.get('/safe-zones', getSafeZones);
router.delete('/safe-zones/:id', deleteSafeZone);

export default router;