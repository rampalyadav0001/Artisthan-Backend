import { Artisan } from '../models/artisan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createArtisan = asyncHandler(async (req, res) => {
  const { name, desc, artisan_id ,craft,mobile,gender,address,state} = req.body;
  if(!name || !artisan_id || !craft|| !mobile || !gender || !address){
    throw new ApiError(400,"Please provide all the required fields")
  }
  let image = { url: '' };
  console.log(req.files);
  if (req.files && req.files.image) {
    const path = req.files.image[0].path;

    if (path) {
      image = await uploadOnCloudinary(path);
      if (!image) {
        throw new ApiError(400, 'Image upload failed');
      }
    }
  }
  const artisan = new Artisan({
    name,
    image: image.url,
    desc,
    artisan_id,
    craft,
    mobile,
    gender,
    address,
    state,
  });

  try {
    const newArtisan = await artisan.save();
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { artisan: newArtisan },
        message: 'Artisan created successfully',
      })
    );
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});

const getAllArtisans = asyncHandler(async (req, res) => {
  try {
    const artisans = await Artisan.find();
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { artisans },
        message: 'Artisans fetched successfully',
      })
    );
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});
const getArtisanById = asyncHandler(async (req, res) => {

  const { artisan_id } = req.query;
  if (!artisan_id) {
    throw new ApiError(400, 'Please provide artisan id');
  }
  // const pipeline = [
  //   {
  //     $match: { name: artisanName }, 
  //   },
  //   {
  //     $lookup: {
  //       from: "products", 
  //       localField: "artisan_id", 
  //       foreignField: "artisan_id", 
  //       as: "products", 
  //     },
  //   },
  //   {
  //     $project: {
  //       name: 1,
  //       products: 1, // Include only artisan name and matched products
  //     },
  //   },
  // ];

  // const results = await Artisan.aggregate(pipeline);
  
  try {
    const artisan = await Artisan.findOne({ artisan_id });
    if (!artisan) {
      throw new ApiError(404, 'Artisan not found');
    }
    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        data: { artisan  },
        message: 'Artisan fetched successfully',
      })
    );
  } catch (error) {
    throw new ApiError(error.message, 400);
  }
});


export { createArtisan, getAllArtisans,getArtisanById };
