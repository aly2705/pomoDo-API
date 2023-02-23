import mongoose, { Date } from 'mongoose';

// Document interface
interface Task {
  category: string;
  completed: boolean;
  dateCompleted: Date | null;
  text: string;
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
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
