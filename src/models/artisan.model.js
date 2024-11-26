import { Schema } from "mongoose";
import mongoose from "mongoose";
const artisanSchema= new Schema({
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
    artisan:{
        type:string,
        required:true
    }
    
});

export const Artisan = mongoose.model("Artisan", artisanSchema);