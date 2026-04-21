import { execQuery } from "@/config/db";
import { verifyAdmin } from "@/common/adminAuth";
import bcrypt from "bcryptjs";

export default async function usersAdmin(req, res) {
  const admin = verifyAdmin(req, res);
  if (!admin) return;

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 20, search = "" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereClause = "";
      let params = [];

      if (search) {
        whereClause = "WHERE username LIKE ? OR email LIKE ?";
        params = [`%${search}%`, `%${search}%`];
      }

      const countQuery = await execQuery(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params,
      );
      const total = countQuery[0].total;

      const users = await execQuery(
        `SELECT uid, email, username, is_admin, status, created_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [...params, String(parseInt(limit)), String(parseInt(offset))],
      );

      return res.status(200).json({
        error: 0,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (err) {
      console.error("admin/users error:", err);
      return res
        .status(500)
        .json({ error: 1, message: "Internal server error" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { uid, action, newPassword, status } = req.body;

      if (!uid) {
        return res.status(400).json({ error: 1, message: "UID required" });
      }

      // Toggle admin
      if (action === "toggle_admin") {
        await execQuery(
          "UPDATE users SET is_admin = NOT is_admin WHERE uid = ?",
          [uid],
        );
        return res
          .status(200)
          .json({ error: 0, message: "Admin status updated" });
      }

      // Change password
      if (action === "change_password") {
        if (!newPassword || newPassword.length < 6) {
          return res
            .status(400)
            .json({ error: 1, message: "Password minimal 6 karakter" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashed = bcrypt.hashSync(newPassword, salt);
        await execQuery("UPDATE users SET password = ? WHERE uid = ?", [
          hashed,
          uid,
        ]);
        return res
          .status(200)
          .json({ error: 0, message: "Password user berhasil diubah" });
      }

      // Change user status (0=active, 1=suspended, 2=deactive)
      if (action === "change_status") {
        const statusVal = parseInt(status);
        if (![0, 1, 2].includes(statusVal)) {
          return res
            .status(400)
            .json({ error: 1, message: "Status tidak valid" });
        }
        await execQuery("UPDATE users SET status = ? WHERE uid = ?", [
          statusVal,
          uid,
        ]);
        const labels = { 0: "Active", 1: "Suspended", 2: "Deactivated" };
        return res.status(200).json({
          error: 0,
          message: `User status changed to ${labels[statusVal]}`,
        });
      }

      return res.status(400).json({ error: 1, message: "Invalid action" });
    } catch (err) {
      console.error("admin/users PATCH error:", err);
      return res
        .status(500)
        .json({ error: 1, message: "Internal server error" });
    }
  }

  return res.status(405).json({ error: 1, message: "Method not allowed" });
}
