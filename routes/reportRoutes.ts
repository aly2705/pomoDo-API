import express, { Router } from 'express';
import * as authController from '../controllers/authController';
import * as reportController from '../controllers/reportController';

const router: Router = express.Router();

router.use(authController.protect);
router.get('/calendar', reportController.getCurrentYearCalendar);
// router.post('/import', reportController.importReports);
router
  .route('/')
  .get(reportController.getAllReports)
  .post(reportController.createReport);
router
  .route('/:id')
  .get(reportController.getReport)
  .patch(reportController.updateReport)
  .delete(reportController.deleteReport);

export default router;
