import { Artisan } from '../models/artisan.model.js';
import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createProduct = asyncHandler(async (req, res) => {
  const { name, desc, price, artisan } = req.body;

  // Validate required fields
  if (!name || !desc || !price || !artisan) {
    throw new ApiError(
      400,
      'All fields (name, desc, price, artisan) are required'
    );
  }

  const existingArtisan = await Artisan.findOne({ name: artisan });
  if (!existingArtisan) {
    throw new ApiError(400, 'Artisan not found');
  }
  let image = { url: '' };

  // Handle image upload
  if (req.files && req.files.image) {
    const { path } = req.files.image[0];
    if (path) {
      image = await uploadOnCloudinary(path);
      if (!image || !image.url) {
        throw new ApiError(400, 'Image upload failed');
      }
    }
  }
  const product = new Product({
    name,
    image: image.url,
    desc,
    price,
    artisan: existingArtisan._id,
  });
  try {
    const newProduct = await product.save();
    return res.status(200).json(
      new ApiResponse(200,newProduct,'Product created successfully')
    );
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(
      new ApiResponse(200,products,'Products fetched successfully')
    );
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
});

const getAllProductByArtisan = asyncHandler(async (req, res) => {
  const { artisanId } = req.query;

  // Validate artisan query
  if (!artisanId) {
    throw new ApiError(400, 'Please provide artisan ID');
  }

  try {
    // Find artisan by artisan_id
    const artisan = await Artisan.findOne({ artisan_id: artisanId });

    // Check if artisan exists
    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }

    // Find products by artisan ID
    const products = await Product.find({ artisan: artisan._id });

    // Send successful response
    return res.status(200).json(
      new ApiResponse(200, products, 'Products fetched successfully')
    );
  } catch (error) {
    // Handle any other errors
    throw new ApiError(500, error.message || 'Internal Server Error');
  }
});


export { createProduct, getAllProductByArtisan, getAllProducts };
