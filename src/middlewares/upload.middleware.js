const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Factory to create storage for any folder
const getStorage = (folderName) =>
    console.log("Initializing multer storage for folder:", folderName);
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = `uploads/${folderName}`;
      console.log(`Ensuring upload directory exists: ${dir}`);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
      console.log(`Generated unique filename: ${uniqueName} for original file: ${file.originalname}`);
      cb(null, uniqueName);
        },
  });

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only images are allowed"));
};

// Export separate uploaders
const adminUpload = multer({ storage: getStorage("admin"), fileFilter });
const foodPartnerUpload = multer({ storage: getStorage("food_partner"), fileFilter });

module.exports = { adminUpload, foodPartnerUpload };