import { Product } from '../models/product.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { uploadOnCloudinary } from '../utils/cloudinary';

const createProduct = async (req, res, next) => {
  const { name, desc, price, artisan } = req.body;

  let image = { url: '' };
  if (req.files && req.files.image) {
    const { path } = req.file.image[0];
    if (path) {
      image = await uploadOnCloudinary(path);
      if (!image) {
        throw new ApiError(400, 'Image upload failed');
      }
    }
  }

  const product = new Product({
    name,
    image: image.url,
    desc,
    price,
    artisan,
  });

  try {
    const newProduct = await product.save();
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { product: newProduct },
        message: 'Product created successfully',
      })
    );
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { products },
        message: 'Products fetched successfully',
      })
    );
  } catch (error) {
    next(new ApiError(error.message, 400));
  }
};

const getAllProductByArtisan=asyncHandler(async(req,res)=>{
    const artisan=req.query;
    if(!artisan){
      return res.status(400).json({
        message:"Please provide artisan"
      })
    } 
      const products=await Product.find({artisan:artisan});
      return res.status(200).json(new ApiResponse(
          200,
          {products},
          "Products fetched successfully"
      ))

})

export { createProduct, getAllProducts,getAllProductByArtisan };
