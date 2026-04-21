import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function stats(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { type, id } = req.query;

  try {
    if (type === "like") {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      const decode = jwt.verify(token, JWT_SECRET);
      const userId = decode.uid;

      const checkLike = await execQuery(
        "SELECT EXISTS(SELECT 1 FROM like_logs WHERE media_uid = ? AND user_uid = ?) AS toggle_like",
        [id, userId],
      );

      if (checkLike[0].toggle_like) {
        await execQuery(
          "DELETE FROM like_logs WHERE media_uid = ? AND user_uid = ?",
          [id, userId],
        );
      } else {
        await execQuery(
          "INSERT IGNORE INTO like_logs (media_uid, user_uid) VALUES (?, ?)",
          [id, userId],
        );

        await execQuery(
          "UPDATE medias SET media_likes = media_likes + 1 WHERE uid = ?",
          [id],
        );
      }

      return res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 1,
      message: err.message,
    });
  }
}
