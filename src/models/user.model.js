import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define Address Schema
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Street is required"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
  },
  state: {
    type: String,
    required: [true, "State is required"],
  },
  zip: {
    type: Number,
    required: [true, "Zip is required"],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
  },
});

// Define Card Schema
const cardSchema = new mongoose.Schema({
  card_no: {
    type: Number,
    required: [true, "Card number is required"],
  },
  card_holder: {
    type: String,
    required: [true, "Card holder is required"],
  },
  expiry_date: {
    type: Date,
    required: [true, "Expiry date is required"],
  },
  cvv: {
    type: Number,
    required: [true, "CVV is required"],
  },
});

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: [true, "Name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      match: [/^[a-zA-Z0-9]+$/, "is invalid"], // Add your regex
    },
    phone_no: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    avatar: {
      type: String,
    },
    address: {
      type: addressSchema, // Reference to addressSchema
    },
    card: {
      type: cardSchema, // Reference to cardSchema
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware to Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to Compare Passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      Name: this.Name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      Name: this.Name,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
