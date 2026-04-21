import { execQuery } from "@/config/db";
import { verifyAdmin } from "@/common/adminAuth";

export default async function traffic(req, res) {
  const admin = verifyAdmin(req, res);
  if (!admin) return;

  if (req.method !== "GET")
    return res.status(405).json({ error: 1, message: "Method not allowed" });

  try {
    const { page = 1, limit = 30, date_from, date_to } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = [];
    let params = [];

    if (date_from) {
      conditions.push("DATE(visited_at) >= ?");
      params.push(date_from);
    }
    if (date_to) {
      conditions.push("DATE(visited_at) <= ?");
      params.push(date_to);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total unique IPs
    const uniqueIPs = await execQuery(
      `SELECT COUNT(DISTINCT ip_address) as total FROM traffic_logs ${whereClause}`,
      params,
    );

    // Total visits
    const totalVisits = await execQuery(
      `SELECT COUNT(*) as total FROM traffic_logs ${whereClause}`,
      params,
    );

    // Paginated log entries (grouped by IP for unique visitor logic)
    const logs = await execQuery(
      `SELECT ip_address, user_agent, country, city, visited_at, page_path FROM traffic_logs ${whereClause} ORDER BY visited_at DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String(offset)],
    );

    // Top pages
    const topPages = await execQuery(
      `SELECT page_path, COUNT(*) as visits FROM traffic_logs ${whereClause} GROUP BY page_path ORDER BY visits DESC LIMIT 10`,
      params,
    );

    // Visitors per day (last 30 days)
    const dailyVisitors = await execQuery(
      `SELECT DATE(visited_at) as date, COUNT(DISTINCT ip_address) as unique_visitors, COUNT(*) as total_hits FROM traffic_logs WHERE visited_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(visited_at) ORDER BY date DESC`,
      [],
    );

    return res.status(200).json({
      error: 0,
      summary: {
        uniqueVisitors: uniqueIPs[0].total,
        totalVisits: totalVisits[0].total,
      },
      data: logs,
      topPages,
      dailyVisitors,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalVisits[0].total,
        totalPages: Math.ceil(totalVisits[0].total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("admin/traffic error:", err);
    return res
      .status(500)
      .json({ error: 1, message: "Internal server error" });
  }
}
