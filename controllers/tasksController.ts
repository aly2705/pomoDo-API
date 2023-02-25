import Task from '../models/taskModel';
import * as handlerFactory from './handlerFactory';

export const getAllTasks = handlerFactory.getAll(Task);
export const createTask = handlerFactory.createOne(Task);
export const getTask = handlerFactory.getOne(Task);
export const updateTask = handlerFactory.updateOne(Task);
export const deleteTask = handlerFactory.deleteOne(Task);
