import { Router } from 'express';
import * as tasksController from '../controllers/taskController';
import * as authController from '../controllers/authController';

const router: Router = Router();

router.use(authController.protect);
router.delete('/removeCompleted', tasksController.deleteAllCompleted);
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
