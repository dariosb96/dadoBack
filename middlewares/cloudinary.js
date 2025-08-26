const cloudinary = require('cloudinary').v2;
const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const API = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUD,
    api_key: API,
    api_secret: SECRET
})

module.exports = cloudinary;