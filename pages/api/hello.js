// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { execQuery } from "@/config/db"

export default async function handler(req, res) {
  const getUsers = await execQuery("SELECT * FROM users", [])
  res.status(200).json(getUsers)
}
