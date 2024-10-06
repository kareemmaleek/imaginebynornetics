import moment from "moment";
import { execQuery } from "@/config/db";

const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const getFormat = file.originalname.split(".")[1];
    const imageID = crypto.randomUUID().toString();
    //cb(null, `IBN002.${getFormat}`);
    cb(null, `${imageID}-IBN${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
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
    if (err) return res.status(400).json({ error: 1, message: err.code });

    const dateNow = moment().format();
    const id = crypto.randomUUID().toString();

    const query = execQuery("INSERT INTO ");

    res.status(200).json({
      error: 0,
      message: "Images upload sucessfully!",
    });
  });
}
