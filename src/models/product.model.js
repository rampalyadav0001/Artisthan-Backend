import { Schema } from "mongoose";
import mongoose from "mongoose";
const productSchema = new Schema({
    name: {
        type:string,
        required:true
    },
    image:{
        type:string,
        required:true
    },
    desc:{
        type:string,
        required:true
    },
    price:{
        type:number,
        required:true
    },
    aritsan:{
        type:Schema.Types.ObjectId,
        ref:"Artisan",
    }
    
});

export const Product= mongoose.model("Product", productSchema);