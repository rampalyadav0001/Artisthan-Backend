import { Product } from '../models/product.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {asyncHandler} from '../utils/asyncHandler.js';

const createProduct = asyncHandler(async (req, res) => {
  const { name, desc, price, artisan } = req.body;

  // Validate required fields
  if (!name || !desc || !price || !artisan) {
    throw new ApiError(400, 'All fields (name, desc, price, artisan) are required');
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
    artisan,
  });

  try {
    const newProduct = await product.save();
    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        data: { product: newProduct },
        message: 'Product created successfully',
      })
    );
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
});

const getAllProducts = asyncHandler(async (req, res) => {
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
  throw new ApiError(error.message, 500);
  }
});

const getAllProductByArtisan = asyncHandler(async (req, res) => {
  const { artisan } = req.query;

  // Validate artisan query
  if (!artisan) {
    throw new ApiError(400, 'Please provide artisan');
  }

  try {
    const products = await Product.find({ artisan });
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { products },
        message: 'Products fetched successfully',
      })
    );
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
});

export { createProduct, getAllProducts, getAllProductByArtisan };
