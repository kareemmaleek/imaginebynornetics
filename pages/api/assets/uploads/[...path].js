import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { path: filePathArray } = req.query;
  
  const relativePath = filePathArray.join("/");
  const absolutePath = path.join(process.cwd(), "public", "assets", "uploads", relativePath);

  if (fs.existsSync(absolutePath)) {
    const ext = path.extname(absolutePath).toLowerCase();
    const contentType = {
      ".webp": "image/webp",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
    }[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const fileBuffer = fs.readFileSync(absolutePath);
    res.send(fileBuffer);
  } else {
    res.status(404).send("File Not Found");
  }
}
