import { Router } from 'express';
import {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  upadateAccountDetails,
  updateAddress,
  updateCardDetails,
  updateUserAvatar,
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);

router.route('/refresh-token').post(verifyJWT,refreshAccessToken);

router.route('/change-password').post(verifyJWT, changePassword);

router.route('/update-account').patch(verifyJWT, upadateAccountDetails);
router.route('/update-address').patch(verifyJWT, updateAddress);
router.route('/update-card').patch(verifyJWT, updateCardDetails);

router
  .route('/avatar')
  .patch(verifyJWT, upload.single('avatar'), updateUserAvatar);

router.route('/current-user').get(verifyJWT, getCurrentUser);

export default router;
