import { Schema } from "mongoose";
import mongoose from "mongoose";
const productSchema = new Schema({
    name: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    aritsan:{
        type:Schema.Types.ObjectId,
        ref:"Artisan",
    }
    
});

export const Product= mongoose.model("Product", productSchema);