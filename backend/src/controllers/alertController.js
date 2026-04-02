import Alert from '../models/Alert.js';

export const getAlerts = async (_req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 }).populate('vehicleId');

    return res.status(200).json({ alerts });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch alerts.' });
  }
};