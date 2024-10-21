import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,   // Corrected typo
        api_key: process.env.CLOUDINARY_API_KEY,   // Corrected typo
        api_secret: process.env.CLOUDINARY_SECRET_KEY  // Corrected typo
    });
};

export default connectCloudinary;
