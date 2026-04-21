import { execQuery } from "@/config/db";
import { galleryQuerySchema } from "@/common/galleryValidation";
import { logTraffic } from "@/common/trafficLogger";

export default async function getAllImages(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ error: 1, message: "Method not allowed" });

  try {
    // Log traffic (fire and forget)
    logTraffic(req, "/gallery");
    // Validate query params with Joi
    const { error: validationError, value } = galleryQuerySchema.validate(
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

    const { filter, content_type, page, limit } = value;
    const offset = (page - 1) * limit;

    // Build ORDER BY and WHERE based on filter
    let orderClause = "i.created_at DESC";
    let conditions = ["i.approval_status = 'approved'"];
    const params = [];

    // Apply content type filter
    if (content_type && content_type !== "all") {
      conditions.push("i.content_type = ?");
      params.push(content_type);
    }

    switch (filter) {
      case "On Trending":
        orderClause =
          "(i.media_views * 1 + i.media_likes * 3 + i.media_download * 2) DESC, i.created_at DESC";
        break;
      case "Today":
        conditions.push("DATE(i.created_at) = CURDATE()");
        orderClause = "i.created_at DESC";
        break;
      case "Top Likes":
        orderClause = "i.media_likes DESC, i.created_at DESC";
        break;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Count total for pagination
    const countQuery = await execQuery(
      `SELECT COUNT(*) as total FROM medias i ${whereClause}`,
      params,
    );
    const total = countQuery[0].total;

    // Fetch paginated data
    const query = await execQuery(
      `SELECT i.uid, i.media_name, i.media_likes, i.created_at, u.username as created_by, i.updated_at, i.media_engine, i.media_path, i.media_thumb, i.media_views, i.media_download, i.file_size, i.media_ratio, i.content_type FROM medias i LEFT JOIN users u ON i.created_by = u.uid ${whereClause} ORDER BY ${orderClause} LIMIT ? OFFSET ?`,
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
    });
  } catch (err) {
    console.error("getAll error:", err);
    return res.status(500).json({ error: 1, message: "Internal server error" });
  }
}
