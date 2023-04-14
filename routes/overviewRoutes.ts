import express, { Router } from 'express';
import * as overviewController from '../controllers/overviewController';
import * as authController from '../controllers/authController';

const router: Router = express.Router();

router.use(authController.protect);
router
  .route('/myOverview')
  .get(overviewController.getCurrentUserOverview)
  .patch(overviewController.updateCurrentUserOverview);
router
  .route('/')
  .get(authController.restrictTo('admin'), overviewController.getAllOverviews)
  .post(overviewController.createOverview);
router
  .route('/:id')
  .get(overviewController.getOverview)
  .patch(overviewController.updateOverview)
  .delete(overviewController.deleteOverview);

export default router;
