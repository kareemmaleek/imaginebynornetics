import { execQuery } from "@/config/db";

/**
 * Log a visitor's traffic info.
 * Call this in any API or page to track visits.
 */
export async function logTraffic(req, pagePath) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.headers["x-real-ip"] ||
      req.socket?.remoteAddress ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    // Try to get geo data from IP (basic — can be enhanced with a service)
    let country = "Unknown";
    let city = "Unknown";

    try {
      // Use a free IP geo API (optional, can fail silently)
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        country = geoData.country || "Unknown";
        city = geoData.city || "Unknown";
      }
    } catch {
      // Silently ignore geo lookup failures
    }

    await execQuery(
      "INSERT INTO traffic_logs (ip_address, user_agent, country, city, page_path, visited_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [ip, userAgent, country, city, pagePath || req.url],
    );
  } catch (err) {
    // Don't let traffic logging break the main request
    console.error("Traffic log error:", err.message);
  }
}
