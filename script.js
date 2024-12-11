import mongoose from 'mongoose';
import { Artisan } from './src/models/artisan.model.js';
import fs from 'fs';
mongoose.connect('mongodb+srv://Artisthan:wTDZHFuzIIHqBEsy@artisthan.m2oxp.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const importData = async () => {
    try {
        const data = JSON.parse(fs.readFileSync('./artisian.json', 'utf-8'));
        await Artisan.insertMany(data);
        console.log('Data imported successfully!');
        process.exit();
    } catch (err) {
        console.error('Error importing data:', err);
        process.exit(1);
    }
};

importData();
