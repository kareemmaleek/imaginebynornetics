import moment from "moment";
import { execQuery } from "@/config/db";
import xbytes from "xbytes";

const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const sizeOf = require("image-size");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets/uploads");
  },
  filename: function (req, file, cb) {
    const imageID = crypto.randomBytes(16).toString("hex");
    //cb(null, `IBN002.${getFormat}`);
    cb(null, `${imageID}-IBN${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
});

const getAspectRatio = (imgWidth, imgHeight) => {
  const w = imgWidth;
  const h = imgHeight;

  const gcd = (...arr) => {
    const _gcd = (x, y) => (!y ? x : gcd(y, x % y));
    return [...arr].reduce((a, b) => _gcd(a, b));
  };

  const gcdResult = gcd(w, h);

  return `${w / gcdResult}:${h / gcdResult}`;
};

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

    const { engine } = req.body;

    res.req.files.map(async (item) => {
      // console.log(item.filename);
      // console.log(xbytes(item.size));
      // console.log(item.path);

      const fileName = item.filename;
      const fileSize = item.size;
      const filePath = path.join(__dirname, "../../../../../", item.path);
      const fileType = item.mimetype;
      const mimeType = ["image/png", "image/jpg"];

      console.log(fileType);

      if (!mimeType.includes(fileType))
        return res
          .status(400)
          .json({ error: 1, message: "Image format not allowed" });

      const imgDimension = sizeOf(filePath);
      const fileAspectRatio = getAspectRatio(
        imgDimension.width,
        imgDimension.height
      );

      const dateNow = moment().format();
      const id = crypto.randomUUID().toString();

      try {
        const query = await execQuery(
          "INSERT INTO images (id, img_name, status, created_date, created_by, img_engine, img_views, img_download, file_size, img_ratio, img_path) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
          [
            id,
            fileName,
            0,
            dateNow,
            "imaginebynornetics",
            engine,
            0,
            0,
            fileSize,
            fileAspectRatio,
            item.path.replaceAll("\\", "/").replace("public", ""),
          ]
        );

        res.status(200).json({
          error: 0,
          message: "Images upload sucessfully!",
        });
      } catch (err) {
        res.status(400).json({ error: 1, message: err });
      }
    });
  });
}
