import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
    Customer_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

      Cart_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
      },
     
      Bill: {
        type: Number,
        required: true
      },

      Gst: {
        type: Number,
        required: true
      },
     
      Total_Bill: {
        type: Number,
        required: true
      }
      
});

const Order = mongoose.model('Order', OrderSchema);

export default Order;