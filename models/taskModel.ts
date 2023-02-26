import mongoose, { Date } from 'mongoose';

// Document interface
interface Task {
  category: string;
  completed: boolean;
  dateCompleted: Date | null;
  text: string;
  user: mongoose.Types.ObjectId;
}

const taskSchema = new mongoose.Schema<Task>({
  category: {
    type: String,
    required: [true, 'A task must have a category'],
    enum: ['work', 'study', 'exercise', 'health', 'wellness', 'chores'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  dateCompleted: Date,
  text: {
    type: String,
    required: [true, 'A task must have some description!'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A task must belong to a user'],
  },
});

const Task: mongoose.Model<Task> = mongoose.model('Task', taskSchema);

export default Task;
