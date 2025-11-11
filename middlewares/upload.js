const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "catalogo",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "heif"],
    format: async () => "jpg",
    transformation: [
      { width: 800, crop: "limit" },
      { quality: "auto" },
    ],
  },
});

const upload = multer({ storage });


const uploadMultiple = (req, res, next) => {
  multer({ storage }).any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }

    // reorganizamos archivos por campo
    req.filesByField = {};
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (!req.filesByField[file.fieldname]) {
          req.filesByField[file.fieldname] = [];
        }
        req.filesByField[file.fieldname].push(file);
      }
    }

    next();
  });
};

module.exports = { upload, uploadMultiple };




