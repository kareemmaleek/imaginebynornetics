import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function getMyImages(req, res) {
  if (req.method !== "GET")
    return res.status(403).json({ message: "Not Allowed!" });

  // Verify token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: 1, message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const userId = decoded.uid;

    if (!userId) {
      return res.status(200).json({ error: 1, message: "Invalid token, please re-login" });
    }

    const query = await execQuery(
      "SELECT i.uid, i.img_name, i.created_at, u.username as created_by, i.img_engine, i.img_views, i.img_download, i.file_size, i.img_ratio, i.img_path FROM images i LEFT JOIN users u ON i.created_by = u.uid WHERE i.created_by = ? ORDER BY i.created_at DESC",
      [userId],
    );

    return res.status(200).json({
      error: 0,
      data: query,
    });
  } catch (err) {
    console.error("getMyImages error:", err);
    return res.status(500).json({ error: 1, message: "Server error" });
  }
}
