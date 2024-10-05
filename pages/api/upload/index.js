const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const getFormat = file.originalname.split(".")[1];
    const imageID = crypto.randomUUID().toString();
    //cb(null, `IBN002.${getFormat}`);
    cb(null, `${imageID}.${getFormat}`);
  },
});

const fileFilter = async (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error("Only .png, .jpg, and .jpeg formats are allowed!");
    cb(null, false);
    // throw error;
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1000000 },
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, multer will handle it
  },
};

export default async function uploadImages(req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ message: "Not Allowed!" });

  await upload.array("images", 12)(req, res, (err) => {
    if (err) return res.status(400).json({ error: 1, message: err });

    res.status(200).json({
      error: 0,
      message: "Images upload sucessfully!",
    });
  });
}
