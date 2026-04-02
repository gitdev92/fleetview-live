import mongoose from 'mongoose';
import crypto from 'crypto';

const generateTrackerToken = () => crypto.randomBytes(24).toString('hex');

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trackerToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    lastLocation: {
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
      speed: {
        type: Number,
        default: 0,
      },
      timestamp: {
        type: Date,
        default: null,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

vehicleSchema.pre('validate', function setTrackerToken(next) {
  if (this.isNew && !this.trackerToken) {
    this.trackerToken = generateTrackerToken();
  }

  next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
