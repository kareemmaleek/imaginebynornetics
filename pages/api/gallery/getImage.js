import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";
import xbytes from "xbytes";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function getImage(req, res) {
  if (!req.method === "GET")
    return res.status(403).json({ message: "Not Allowed!" });

  const { uid } = req.query;

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const bearer = authHeader.split(" ")[1];

    const decoded = jwt.verify(bearer, JWT_SECRET);
    const userId = decoded.uid;

    try {
      const query = await execQuery(
        "SELECT i.*, u.username as creator_name FROM medias i LEFT JOIN users u ON i.created_by = u.uid WHERE i.uid = ?",
        [uid],
      );

      const checkLike = await execQuery(
        "SELECT EXISTS(SELECT 1 FROM like_logs WHERE media_uid = ? AND user_uid = ?) AS toggle_like",
        [uid, userId],
      );

      const resData = {
        ...query[0],
        file_size: xbytes(query[0].file_size),
        ...checkLike[0],
      };

      return res.status(200).json({
        error: 0,
        data: resData,
      });
    } catch (err) {
      return res.status(400).json({ error: 1, message: err });
    }
  } else {
    try {
      const query = await execQuery(
        "SELECT i.*, u.username as creator_name FROM medias i LEFT JOIN users u ON i.created_by = u.uid WHERE i.uid = ?",
        [uid],
      );

      const resData = { ...query[0], file_size: xbytes(query[0].file_size) };

      return res.status(200).json({
        error: 0,
        data: resData,
      });
    } catch (err) {
      return res.status(400).json({ error: 1, message: err });
    }
  }
}
