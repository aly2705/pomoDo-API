import { Router } from 'express';
import * as tasksController from '../controllers/tasksController';

const router: Router = Router();

router
  .route('/')
  .get(tasksController.getAllTasks)
  .post(tasksController.createTask);
router
  .route('/:id')
  .get(tasksController.getTask)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask);

export default router;
