import mongoose from 'mongoose';

const locationHistorySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  },
);

locationHistorySchema.index({ vehicleId: 1, timestamp: 1 });

const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);

export default LocationHistory;
