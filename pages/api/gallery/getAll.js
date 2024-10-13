import { execQuery } from "@/config/db";

export default async function getAllImages(req, res) {
  if (req.method !== "GET")
    return res.status(403).json({ message: "Not Allowed!" });

  try {
    const query = await execQuery("SELECT * FROM images", []);
    // console.log(query);

    return res.status(200).json({
      error: 0,
      data: query,
    });
  } catch (err) {
    return res.status(400).json({ error: 1, message: err });
  }
}
