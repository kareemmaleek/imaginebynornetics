import { execQuery } from "@/config/db";
import jwt from "jsonwebtoken";
import { myImagesQuerySchema } from "@/common/galleryValidation";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function getMyImages(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: 1, message: "Method not allowed" });

  // Verify token
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: 1, message: "Unauthorized — token required" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.uid;

    if (!userId) {
      return res
        .status(401)
        .json({ error: 1, message: "Invalid token, please re-login" });
    }

    // Validate query params with Joi
    const { error: validationError, value } = myImagesQuerySchema.validate(
      req.query,
      { abortEarly: false, stripUnknown: true },
    );

    if (validationError) {
      const messages = validationError.details.map((d) => d.message);
      return res.status(400).json({
        error: 1,
        message: "Validation error",
        details: messages,
      });
    }

    const { content_type, ai_engine, aspect_ratio, month, page, limit } = value;
    const offset = (page - 1) * limit;

    // Build dynamic WHERE conditions
    let conditions = ["i.created_by = ?"];
    let params = [userId];

    // Content type filter
    if (content_type !== "all") {
      conditions.push("i.content_type = ?");
      params.push(content_type);
    }

    // AI engine filter
    if (ai_engine !== "all") {
      conditions.push("i.media_engine = ?");
      params.push(ai_engine);
    }

    // Aspect ratio filter
    if (aspect_ratio !== "all") {
      conditions.push("i.media_ratio = ?");
      params.push(aspect_ratio);
    }

    // Month filter (YYYY-MM)
    if (month && month !== "all") {
      conditions.push("DATE_FORMAT(i.created_at, '%Y-%m') = ?");
      params.push(month);
    }

    const whereClause = "WHERE " + conditions.join(" AND ");

    // Count total
    const countQuery = await execQuery(
      `SELECT COUNT(*) as total FROM medias i ${whereClause}`,
      params,
    );
    const total = countQuery[0].total;

    // Fetch available months for filter dropdown
    const monthsQuery = await execQuery(
      `SELECT DISTINCT DATE_FORMAT(created_at, '%Y-%m') as month_value, DATE_FORMAT(created_at, '%M, %Y') as month_label FROM medias WHERE created_by = ? ORDER BY month_value DESC`,
      [userId],
    );

    // Fetch available engines for filter dropdown
    const enginesQuery = await execQuery(
      `SELECT DISTINCT media_engine FROM medias WHERE created_by = ? AND media_engine IS NOT NULL AND media_engine != '' ORDER BY media_engine ASC`,
      [userId],
    );

    // Fetch available ratios for filter dropdown
    const ratiosQuery = await execQuery(
      `SELECT DISTINCT media_ratio FROM medias WHERE created_by = ? AND media_ratio IS NOT NULL AND media_ratio != '' ORDER BY media_ratio ASC`,
      [userId],
    );

    // Fetch paginated data
    const query = await execQuery(
      `SELECT i.uid, i.media_name, i.created_at, i.created_by as creator_uid, u.username as creator_name, i.media_engine, i.media_views, i.media_download, i.media_likes, i.file_size, i.media_ratio, i.media_path, i.media_thumb, i.approval_status FROM medias i LEFT JOIN users u ON i.created_by = u.uid ${whereClause} ORDER BY i.created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String(offset)],
    );

    return res.status(200).json({
      error: 0,
      data: query,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      filterOptions: {
        months: monthsQuery,
        engines: enginesQuery.map((e) => e.media_engine),
        ratios: ratiosQuery.map((r) => r.media_ratio),
      },
    });
  } catch (err) {
    console.error("getMyImages error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: 1,
        message: "Token invalid or expired, please re-login",
      });
    }
    return res.status(500).json({ error: 1, message: "Internal server error" });
  }
}
