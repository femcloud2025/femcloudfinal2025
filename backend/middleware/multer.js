import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

export default upload;
