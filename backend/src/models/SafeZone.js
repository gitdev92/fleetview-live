import mongoose from 'mongoose';

const safeZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    center_lat: {
      type: Number,
      required: true,
    },
    center_lng: {
      type: Number,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
      min: 1,
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

const SafeZone = mongoose.model('SafeZone', safeZoneSchema);

export default SafeZone;