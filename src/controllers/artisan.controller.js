import { Artisan } from '../models/artisan.model';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { uploadOnCloudinary } from '../utils/cloudinary';
import { Product } from '../models/product.model';

const createArtisan = asyncHandler(async (req, res) => {
  const { name, desc, artisan_id } = req.body;

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

  const artisan = new Artisan({
    name,
    image: image.url,
    desc,
    artisan_id,
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
    next(new ApiError(error.message, 400));
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
    next(new ApiError(error.message, 400));
  }
});



export { createArtisan, getAllArtisans };
