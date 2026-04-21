import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function changePassword(req, res) {
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

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({ error: 1, message: "Semua field harus diisi" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: 1, message: "Password baru minimal 6 karakter" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 1, message: "Konfirmasi password tidak cocok" });
    }

    // Get current password hash
    const users = await execQuery(
      "SELECT password FROM users WHERE uid = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 1, message: "User not found" });
    }

    // Verify current password
    const isMatch = bcrypt.compareSync(currentPassword, users[0].password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: 1, message: "Password lama salah" });
    }

    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await execQuery("UPDATE users SET password = ? WHERE uid = ?", [
      hashedPassword,
      userId,
    ]);

    return res.status(200).json({
      error: 0,
      message: "Password berhasil diubah!",
    });
  } catch (err) {
    console.error("changePassword error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: 1, message: "Token invalid or expired" });
    }
    return res.status(500).json({ error: 1, message: "Internal server error" });
  }
}
