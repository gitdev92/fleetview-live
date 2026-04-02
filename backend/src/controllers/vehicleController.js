import Vehicle from '../models/Vehicle.js';
import mongoose from 'mongoose';

export const createVehicle = async (req, res) => {
  try {
    const { name, deviceId, owner } = req.body;

    if (!name || !deviceId || !owner) {
      return res.status(400).json({ message: 'name, deviceId, and owner are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: 'Invalid owner id.' });
    }

    const existingVehicle = await Vehicle.findOne({ deviceId: deviceId.trim() });
    if (existingVehicle) {
      return res.status(409).json({ message: 'Vehicle with this deviceId already exists.' });
    }

    const vehicle = await Vehicle.create({
      name: name.trim(),
      deviceId: deviceId.trim(),
      owner,
    });

    return res.status(201).json({ message: 'Vehicle created successfully.', vehicle });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create vehicle.' });
  }
};

export const getVehicles = async (_req, res) => {
  try {
    const vehicles = await Vehicle.find()
      .sort({ createdAt: -1 })
      .populate('owner', 'name email');

    return res.status(200).json({ vehicles });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch vehicles.' });
  }
};

export const getVehicleLocation = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const vehicle = await Vehicle.findOne({ deviceId }).populate('owner', 'name email');

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    return res.status(200).json({
      vehicle,
      location: vehicle.lastLocation,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch vehicle location.' });
  }
};