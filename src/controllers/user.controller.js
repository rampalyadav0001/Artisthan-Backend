import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating refresh & access token'
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { Name, phone_no, email, password, username } = req.body;

  if (
    [Name, phone_no, email, password, username].some(
      (field) => field?.trim() === ''
    )
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check if user already exists: username, email
  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, 'User already exists');
  }

  // Check for images, check for avatar
  // Upload them to cloudinary, avatar
  let avatar = { url: '' };
  if (req.files && req.files.avatar) {
    const avatarLocalPath = req.files.avatar[0]?.path;
    if (avatarLocalPath) {
      avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
      }
    }
  }

  // Create user object - create entry in db
  const user = await User.create({
    Name,
    phone_no,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase(),
  });

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  // Set options for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json({
      message: 'User successfully logged in',
      user: createdUser,
      accessToken,
      refreshToken,
    });
});

const loginUser = asyncHandler(async (req, res) => {
  // Destructure email, username, and password from request body
  const { email, username, password } = req.body;
  console.log(email);

  // Check if username and email are provided
  if (!username && !email) {
    // Throw an error if not
    throw new ApiError(400, 'Username and email are required');
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  // If user is not found
  if (!user) {
    // Throw an error
    throw new ApiError(400, "User doesn't exist");
  }

  // Check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    // Throw an error if password is incorrect
    throw new ApiError(401, 'Invalid password');
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Find user again to exclude password and refreshToken
  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  // Set options for cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  // Return response with user, accessToken, refreshToken, and success message
  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User successfully logged in'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
        //accessToken: undefined,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'user loged out'));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  let incomingRefreshToken = '';  
  if (req.cookies && req.cookies.refreshToken) {
    incomingRefreshToken = req.cookies.refreshToken;
  } else if (req.body && req.body.refreshToken) {
    incomingRefreshToken = req.body.refreshToken;
  } else {
    throw new ApiError(401, 'unauthorized request');
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid Refresh Token');
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh Token expired');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          'new tokens generated'
        )
      );
  } catch (error) {}
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    //additional check
    throw new ApiError(404, 'user not found');
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, 'incorrect password');
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json(new ApiResponse(200, {}, 'password changed'));
});

const upadateAccountDetails = asyncHandler(async (req, res) => {
  const { Name, email } = req.body;
  if (!Name || !email) {
    throw new ApiError(400, 'please provide all values');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        Name: Name,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'account details updated successfully'));
});
const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zip, country } = req.body;

  // Validate that all fields are provided
  if (!street || !city || !state || !zip || !country) {
    throw new ApiError(400, 'Please provide all address fields');
  }

  // Update user's address
  const user = await User.findByIdAndUpdate(
    req.user?._id, // Ensure the authenticated user's ID is available in `req.user`
    {
      $set: {
        address: { street, city, state, zip, country },
      },
    },
    {
      new: true, // Return the updated user object
    }
  ).select('-password'); // Exclude the password field

  // Respond with the updated user and a success message
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Address updated successfully'));
});

const updateCardDetails = asyncHandler(async (req, res) => {
  const { card_no, card_holder, expiry_date, cvv } = req.body;

  // Validate card details
  if (!card_no || !card_holder || !expiry_date || !cvv) {
    throw new ApiError(400, 'Please provide all card details');
  }

  // Validate expiry_date format (Optional, depends on requirements)
  if (isNaN(new Date(expiry_date).getTime())) {
    throw new ApiError(400, 'Invalid expiry date format');
  }

  // Update user's card details
  const user = await User.findByIdAndUpdate(
    req.user?._id, // Ensure the authenticated user's ID is available in `req.user`
    {
      $set: {
        card: { card_no, card_holder, expiry_date, cvv },
      },
    },
    {
      new: true, // Return the updated user object
    }
  ).select('-password'); // Exclude the password field

  // Respond with the updated user and a success message
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Card details updated successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, 'please provide an avatar');
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, 'avatar upload failed');
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select('-password');
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'avatar updated successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, 'current user fetched successfully'));
});

export {
  changePassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  upadateAccountDetails,
  updateAddress,
  updateCardDetails,
  updateUserAvatar,
};
