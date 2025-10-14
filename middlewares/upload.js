const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "catalogo",  
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heif"],
    format: async (req, file) => "jpg",
    transformation: [
      { width: 800, crop: "limit" },     
      { quality: "auto" }               
    ],
  },
});
const upload = multer({ storage });
const uploadMultiple = upload.array("images", 5);


module.exports = {upload, uploadMultiple}
