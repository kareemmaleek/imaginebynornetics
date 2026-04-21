import { execQuery } from "@/config/db";
import { verifyAdmin } from "@/common/adminAuth";

/**
 * Bootstrap admin tables.
 * POST /api/admin/setup — creates traffic_logs and adds approval_status column if missing.
 */
export default async function setup(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: 1, message: "Method not allowed" });

  const admin = verifyAdmin(req, res);
  if (!admin) return;

  try {
    // Create traffic_logs table
    await execQuery(`
      CREATE TABLE IF NOT EXISTS traffic_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        user_agent TEXT,
        country VARCHAR(100) DEFAULT 'Unknown',
        city VARCHAR(100) DEFAULT 'Unknown',
        page_path VARCHAR(255),
        visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ip (ip_address),
        INDEX idx_visited_at (visited_at)
      )
    `, []);

    // Add approval_status and media_thumb to medias if not exists
    try {
      await execQuery(
        "ALTER TABLE medias ADD COLUMN IF NOT EXISTS approval_status VARCHAR(20) DEFAULT 'pending'",
        [],
      );
      await execQuery(
        "ALTER TABLE medias ADD COLUMN IF NOT EXISTS media_thumb VARCHAR(255)",
        [],
      );
    } catch (e) {
      // Columns likely already exist or syntax not supported (use individual tries if needed)
    }

    // Add is_admin to users if not exists
    try {
      await execQuery(
        "ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE",
        [],
      );
    } catch (e) {
      // Column likely already exists — ignore
    }

    return res.status(200).json({
      error: 0,
      message: "Admin tables setup complete!",
    });
  } catch (err) {
    console.error("admin/setup error:", err);
    return res
      .status(500)
      .json({ error: 1, message: "Setup failed: " + err.message });
  }
}
