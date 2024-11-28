import { Router } from 'express';
import {
  createArtisan,
  getAllArtisans,
} from '../controllers/artisan.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/list-artisan').post(
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  verifyJWT,
  createArtisan
);

router.get('/artisan', verifyJWT,getAllArtisans);

export default router;
