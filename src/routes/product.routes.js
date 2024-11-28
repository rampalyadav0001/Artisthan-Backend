import { Router } from 'express';
import {
  createProduct,
  getAllProductByArtisan,
  getAllProducts,
} from '../controllers/product.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Route to get all products
router.get('/list-product', verifyJWT, getAllProducts);

// Route to create a new product
router.post(
  '/create-product',
  upload.fields([
    {
      name: 'image',
      maxCount: 1,
    },
  ]),
  verifyJWT,
  createProduct
);

// Route to get products by artisan
router.get('/list-product-by-artisan', verifyJWT, getAllProductByArtisan);

export default router;
