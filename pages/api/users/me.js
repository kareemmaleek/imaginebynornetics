import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function me(req, res) {
  try {
    if (req.method !== "GET")
      return res.status(403).json({ message: "Not Allowed!" });

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(200)
        .json({ error: 1, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({
      error: 0,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        username: decoded.username,
      },
    });
  } catch (err) {
    return res
      .status(200)
      .json({ error: 1, message: "Invalid or expired token" });
  }
}
