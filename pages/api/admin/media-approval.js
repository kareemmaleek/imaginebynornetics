import { execQuery } from "@/config/db";
import { verifyAdmin } from "@/common/adminAuth";

export default async function mediaApproval(req, res) {
  const admin = verifyAdmin(req, res);
  if (!admin) return;

  if (req.method === "GET") {
    try {
      const { page = 1, limit = 20, status = "all" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      let whereClause = "";
      let params = [];

      if (status !== "all") {
        whereClause = "WHERE i.approval_status = ?";
        params = [status];
      }

      const countQuery = await execQuery(
        `SELECT COUNT(*) as total FROM medias i ${whereClause}`,
        params,
      );
      const total = countQuery[0].total;

      const medias = await execQuery(
        `SELECT i.uid, i.media_name, i.media_path, i.media_thumb, i.media_engine, i.media_ratio, i.content_type, i.created_at, i.approval_status, u.username as created_by FROM medias i LEFT JOIN users u ON i.created_by = u.uid ${whereClause} ORDER BY i.created_at DESC LIMIT ? OFFSET ?`,
        [...params, String(limit), String(offset)],
      );

      return res.status(200).json({
        error: 0,
        data: medias,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (err) {
      console.error("admin/media-approval error:", err);
      return res
        .status(500)
        .json({ error: 1, message: "Internal server error" });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { uid, action } = req.body;

      if (!uid || !action) {
        return res
          .status(400)
          .json({ error: 1, message: "UID and action required" });
      }

      if (!["approved", "rejected"].includes(action)) {
        return res.status(400).json({ error: 1, message: "Invalid action" });
      }

      await execQuery("UPDATE medias SET approval_status = ? WHERE uid = ?", [
        action,
        uid,
      ]);

      return res.status(200).json({
        error: 0,
        message: `Media ${action} successfully`,
      });
    } catch (err) {
      console.error("admin/media-approval PATCH error:", err);
      return res
        .status(500)
        .json({ error: 1, message: "Internal server error" });
    }
  }

  return res.status(405).json({ error: 1, message: "Method not allowed" });
}
