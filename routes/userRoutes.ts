import express from 'express';
import * as authController from '../controllers/authController';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.post('/updatePassword', authController.updatePassword);
router
  .route('/me')
  .get(userController.getCurrentUser)
  .patch(userController.updateCurrentUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
