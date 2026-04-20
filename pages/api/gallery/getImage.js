import { execQuery } from "@/config/db";

export default async function getImage(req, res) {
  if (!req.method === "GET")
    return res.status(403).json({ message: "Not Allowed!" });

  const { uid } = req.query;

  // console.log(id);

  try {
    const query = await execQuery(
      "SELECT i.*, u.username as created_by FROM images i LEFT JOIN users u ON i.created_by = u.uid WHERE i.uid = ?",
      [uid],
    );

    return res.status(200).json({
      error: 0,
      data: query,
    });
  } catch (err) {
    return res.status(400).json({ error: 1, message: err });
  }
}
