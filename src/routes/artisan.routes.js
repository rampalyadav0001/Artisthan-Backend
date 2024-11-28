import { Router } from 'express';
import {
  createArtisan,
  getAllArtisans,
} from '../controllers/artisan.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/create-artisan').post(
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  verifyJWT,
  createArtisan
);

router.get('/list-artisan', verifyJWT,getAllArtisans);

export default router;
