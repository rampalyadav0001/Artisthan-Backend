import mongoose, { Schema } from 'mongoose';
const artisanSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  desc: {
    type: String,
  },
  artisan_id: {
    type: String,
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
  },
});

export const Artisan = mongoose.model('Artisan', artisanSchema);
