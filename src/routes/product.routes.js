import { getAllProducts,getAllProductByArtisan,createProduct } from "../controllers/product.controller";
import { Router } from 'express';
import { verifyJWT } from "../middlewares/auth.middleware";


const router = Router();

router.route('/list-product').post(verifyJWT,getAllProducts);
router.route('/create-product').post(verifyJWT,createProduct);
router.route('/list-productbyartisan').get(verifyJWT,getAllProductByArtisan);


export default router;

