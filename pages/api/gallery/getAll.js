import { execQuery } from "@/config/db";

export default async function getAllImages(req, res) {
  if (req.method !== "GET")
    return res.status(403).json({ message: "Not Allowed!" });

  try {
    const query = await execQuery(
      "SELECT i.uid, i.img_name, i.created_at, u.username as created_by, i.updated_at, i.img_engine, i.img_path, i.img_views, i.img_download, i.file_size, i.img_ratio FROM images i LEFT JOIN users u ON i.created_by = u.uid ORDER BY i.created_at DESC",
      [],
    );
    // console.log(query);

    return res.status(200).json({
      error: 0,
      data: query,
    });
  } catch (err) {
    return res.status(400).json({ error: 1, message: err });
  }
}
