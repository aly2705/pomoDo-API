import mongoose from 'mongoose';

interface Report {
  date: Date;
  totalActiveHours: number;
  numberOfCompletedPomodoros: number;
  numberOfCompletedTasks: number;
  user: mongoose.Types.ObjectId;
}

const reportSchema = new mongoose.Schema<Report>({
  date: {
    type: Date,
    required: [true, 'A report must have a date!'],
    validate: {
      validator: (input: Date) => {
        const enteredDate = new Date(input);

        const enteredDay = new Date(
          enteredDate.getFullYear(),
          enteredDate.getMonth(),
          enteredDate.getDate(),
          2,
          0
        );

        const today = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          2,
          0
        );

        return enteredDay.getTime() < today.getTime();
      },
      message: 'Current or future dates are not valid report dates!',
    },
  },
  totalActiveHours: {
    type: Number,
    required: [true, 'A report must have a number of active hours registered!'],
    min: 0,
    max: 18,
  },
  numberOfCompletedPomodoros: {
    type: Number,
    required: [true, 'A report must have a number of completed pomodoros!'],
    default: 0,
    min: 0,
  },
  numberOfCompletedTasks: {
    type: Number,
    required: [true, 'A report must have a number of completed tasks!'],
    default: 0,
    min: 0,
  },
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A report must belong to a user'],
  },
});

reportSchema.pre('save', function (next) {
  //   console.log(this);
  this.date = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    this.date.getDate(),
    2,
    0
  );

  next();
});

const Report: mongoose.Model<Report> = mongoose.model('Report', reportSchema);

export default Report;
