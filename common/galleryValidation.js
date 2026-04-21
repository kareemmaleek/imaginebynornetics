import Joi from "joi";

/**
 * Validate query params for GET /api/gallery/getAll
 * Supports filter, pagination (page, limit)
 */
export const galleryQuerySchema = Joi.object({
  filter: Joi.string()
    .valid("On Trending", "Today", "Top Likes")
    .default("On Trending")
    .messages({
      "any.only": "Filter must be one of: On Trending, Today, Top Likes",
    }),
  content_type: Joi.string()
    .valid("image", "video", "all")
    .default("all")
    .messages({
      "any.only": "Invalid content type",
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

/**
 * Validate query params for GET /api/gallery/getMyImages
 * Supports content_type, ai_engine, aspect_ratio, month, pagination
 */
export const myImagesQuerySchema = Joi.object({
  content_type: Joi.string()
    .valid("image", "video", "all")
    .default("all")
    .messages({
      "any.only": "Content type must be one of: image, video, all",
    }),
  ai_engine: Joi.string().trim().default("all"),
  aspect_ratio: Joi.string().trim().default("all"),
  month: Joi.string()
    .pattern(/^\d{4}-\d{2}$/)
    .allow("all", "")
    .default("all")
    .messages({
      "string.pattern.base": "Month format must be YYYY-MM (e.g., 2026-04)",
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});
