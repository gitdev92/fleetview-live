import mongoose from 'mongoose';
import SafeZone from '../models/SafeZone.js';

export const createSafeZone = async (req, res) => {
  try {
    const { name, userId, center_lat, center_lng, radius } = req.body;
    const numericCenterLat = Number(center_lat);
    const numericCenterLng = Number(center_lng);
    const numericRadius = Number(radius);

    if (!name || !userId || center_lat === undefined || center_lng === undefined || radius === undefined) {
      return res.status(400).json({ message: 'name, userId, center_lat, center_lng, and radius are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'userId must be a valid ObjectId.' });
    }

    if (!Number.isFinite(numericCenterLat) || !Number.isFinite(numericCenterLng) || !Number.isFinite(numericRadius) || numericRadius <= 0) {
      return res.status(400).json({ message: 'center_lat, center_lng, and radius must be valid numbers.' });
    }

    const safeZone = await SafeZone.create({
      name: name.trim(),
      userId,
      center_lat: numericCenterLat,
      center_lng: numericCenterLng,
      radius: numericRadius,
    });

    return res.status(201).json({
      message: 'Safe zone created successfully.',
      safeZone,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create safe zone.' });
  }
};

export const getSafeZones = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};

    if (userId) {
      filter.userId = userId;
    }

    const safeZones = await SafeZone.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({ safeZones });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch safe zones.' });
  }
};

export const deleteSafeZone = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid safe zone id.' });
    }

    const deletedSafeZone = await SafeZone.findByIdAndDelete(id);

    if (!deletedSafeZone) {
      return res.status(404).json({ message: 'Safe zone not found.' });
    }

    return res.status(200).json({
      message: 'Safe zone deleted successfully.',
      safeZone: deletedSafeZone,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete safe zone.' });
  }
};