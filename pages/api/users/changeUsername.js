import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function changeUsername(req, res) {
  if (req.method !== "PATCH")
    return res.status(405).json({ error: 1, message: "Method not allowed" });

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: 1, message: "Unauthorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.uid;

    const { username } = req.body;

    if (!username || username.trim().length < 3) {
      return res
        .status(400)
        .json({ error: 1, message: "Username minimal 3 karakter" });
    }

    if (username.trim().length > 30) {
      return res
        .status(400)
        .json({ error: 1, message: "Username maksimal 30 karakter" });
    }

    // Only allow alphanumeric, underscores, dots
    if (!/^[a-zA-Z0-9_.]+$/.test(username.trim())) {
      return res.status(400).json({
        error: 1,
        message: "Username hanya boleh huruf, angka, underscore, dan titik",
      });
    }

    // Check if username already taken
    const existing = await execQuery(
      "SELECT uid FROM users WHERE username = ? AND uid != ?",
      [username.trim(), userId],
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ error: 1, message: "Username sudah digunakan" });
    }

    await execQuery("UPDATE users SET username = ? WHERE uid = ?", [
      username.trim(),
      userId,
    ]);

    // Generate new token with updated username
    const newToken = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email,
        username: username.trim(),
        is_admin: decoded.is_admin || false,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      error: 0,
      message: "Username berhasil diubah!",
      token: newToken,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        username: username.trim(),
        is_admin: decoded.is_admin || false,
      },
    });
  } catch (err) {
    console.error("changeUsername error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: 1, message: "Token invalid or expired" });
    }
    return res.status(500).json({ error: 1, message: "Internal server error" });
  }
}
