import { execQuery } from "@/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "ibn_secret_key_2024";

export default async function login(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(403).json({ message: "Not Allowed!" });

    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res
        .status(200)
        .json({ error: 1, message: "Email and password are required" });
    }

    // Find user by email
    const users = await execQuery(
      "SELECT uid, email, password, username FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res
        .status(200)
        .json({ error: 1, message: "Invalid email or password" });
    }

    const user = users[0];

    // Compare password
    const isMatch = bcrypt.compareSync(pwd, user.password);

    if (!isMatch) {
      return res
        .status(200)
        .json({ error: 1, message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      error: 0,
      message: "Login successful!",
      token,
      user: {
        uid: user.uid,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: 1, message: "Server error" });
  }
}
