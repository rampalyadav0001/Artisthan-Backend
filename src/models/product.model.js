import mongoose, { Schema } from 'mongoose';
const productSchema = new Schema({
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
  price: {
    type: Number,
    required: true,
  },
  artisan: {
    type: Schema.Types.ObjectId,
    ref: 'Artisan',
  },
});

export const Product = mongoose.model('Product', productSchema);
