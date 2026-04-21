import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

/**
 * Verify that the request comes from an admin user.
 * Returns decoded token data or sends error response.
 */
export function verifyAdmin(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: 1, message: "Unauthorized" });
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.is_admin) {
      res
        .status(403)
        .json({ error: 1, message: "Forbidden — Admin access only" });
      return null;
    }

    return decoded;
  } catch (err) {
    res.status(401).json({ error: 1, message: "Token invalid or expired" });
    return null;
  }
}
