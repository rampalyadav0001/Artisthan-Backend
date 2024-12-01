import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  Customer_ID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Order_Item: [
    {
      order: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      quantity: Number,
      image: String,
      Price: Number,
    },
  ],

  Bill: {
    type: Number,
    required: true,
  },
});

export const Cart = mongoose.model('Cart', CartSchema);
