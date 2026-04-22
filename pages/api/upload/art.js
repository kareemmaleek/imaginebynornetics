import moment from "moment";
import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";
import sharp from "sharp";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const sizeOf = require("image-size");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "public", "assets", "uploads");
    console.log("Saving file to:", uploadDir); // Tambahkan log ini
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const imageID = crypto.randomBytes(16).toString("hex");
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
    bodyParser: false,
  },
};

export default async function uploadImages(req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ message: "Not Allowed!" });

  let createdBy = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
      createdBy = decoded.uid;
    } catch (e) {}
  }

  await upload.array("images", 12)(req, res, async (err) => {
    if (err) return res.status(400).json({ error: 1, message: err.code });

    const { engine, aspect_ratio } = req.body;
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg"];

    try {
      for (const item of res.req.files) {
        if (!mimeTypes.includes(item.mimetype)) {
          return res.status(400).json({ error: 1, message: "Invalid format" });
        }

        const fileName = item.filename;
        const fileSize = item.size;
        const filePath = item.path;
        const imgDimension = sizeOf(filePath);
        const fileAspectRatio =
          aspect_ratio ||
          getAspectRatio(imgDimension.width, imgDimension.height);

        // Generate WebP Thumbnail
        const thumbName = `${fileName.split("-IBN")[0]}-thumb.webp`;
        const thumbPath = path.join(path.dirname(filePath), thumbName);

        await sharp(filePath)
          .webp({ quality: 70 })
          .resize(800, null, { withoutEnlargement: true })
          .toFile(thumbPath);

        const uid = crypto.randomUUID();
        const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

        await execQuery(
          "INSERT INTO medias (uid, media_name, status, created_by, media_engine, media_views, media_download, file_size, media_ratio, content_type, approval_status, created_at, media_path, media_thumb, media_width, media_height) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            uid,
            fileName,
            1,
            createdBy,
            engine,
            0,
            0,
            fileSize,
            fileAspectRatio,
            "image",
            "pending",
            createdAt,
            item.path.replace(/\\/g, "/").split("/public")[1] || item.path,
            item.path
              .replace(/\\/g, "/")
              .split("/public")[1]
              .replace(fileName, thumbName) || item.path,
            imgDimension.width,
            imgDimension.height,
          ],
        );
      }

      return res.status(200).json({
        error: 0,
        message: "Images uploaded successfully!",
      });
    } catch (dbErr) {
      console.error(dbErr);
      return res
        .status(500)
        .json({ error: 1, message: "Internal server error" });
    }
  });
}
