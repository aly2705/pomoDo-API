import mongoose, { Date } from 'mongoose';

type Hour = { hour: number; activeMinutes: number };

interface Overview extends Document {
  activeMinutesAlreadyAdded: number;
  date: Date;
  hours: Hour[];
  numberOfCompletedPomodoros: number;
  numberOfCompletedTasks: number;
  user: mongoose.Types.ObjectId;
}

const overviewSchema = new mongoose.Schema<Overview>({
  activeMinutesAlreadyAdded: Number,
  date: {
    type: Date,
    required: [true, 'An overview must have a date'],
  },
  hours: [
    {
      hour: {
        type: Number,
        required: [true, 'Hours array should have hours between 5-23'],
        min: 5,
        max: 23,
      },
      activeMinutes: { type: Number, default: 0, min: 0, max: 60 },
    },
  ],
  numberOfCompletedPomodoros: { type: Number, default: 0, min: 0 },
  numberOfCompletedTasks: { type: Number, default: 0, min: 0 },
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'An overview must belong to a user'],
    unique: true,
  },
});

const Overview: mongoose.Model<Overview> = mongoose.model(
  'Overview',
  overviewSchema
);

export default Overview;
