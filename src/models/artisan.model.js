import mongoose, { Schema } from 'mongoose';
const artisanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  artisan_id: {
    type: Number,
    required: true,
  },
  craft: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

export const Artisan = mongoose.model('Artisan', artisanSchema);
