import mongoose from 'mongoose';

export const WORKOUT_TYPES = [
  'Cardio',
  'Strength',
  'Yoga/Stretching',
  'Sports',
  'Walking/Running',
  'Custom',
];

export const WORKOUT_INTENSITIES = ['Low', 'Med', 'High'];

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: WORKOUT_TYPES,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    intensity: {
      type: String,
      required: true,
      enum: WORKOUT_INTENSITIES,
      default: 'Med',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    calories: {
      type: Number,
      min: 0,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, type: 1, date: -1 });

export const Workout = mongoose.model('Workout', workoutSchema);
