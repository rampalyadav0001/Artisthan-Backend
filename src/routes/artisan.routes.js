import { Router } from 'express';
import {
  createArtisan,
  getAllArtisans,
} from '../controllers/artisan.controller';

const router = Router();

router.route('/list-artisan').post(
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  createArtisan
);

router.get('/artisan', getAllArtisans);

export default router;
