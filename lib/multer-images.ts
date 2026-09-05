import multer from "multer";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${file.filename}-${Date.now()}`);
  },
});

const uploadImages = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const mimeType = file.mimetype;

    if (!mimeType.startsWith("image/")) {
      cb(new Error("Seules les iamges sont acceptées"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadImages;
