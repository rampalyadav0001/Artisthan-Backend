import { Schema } from "mongoose";
import mongoose from "mongoose";
const artisanSchema= new Schema({
    name: {
       type: String,
       required: true
    },
    image: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    artisan_id: {
        type: Number,
        required: true
    }
    
});

export const Artisan = mongoose.model("Artisan", artisanSchema);