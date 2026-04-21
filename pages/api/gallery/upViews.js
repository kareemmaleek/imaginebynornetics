import { execQuery } from "@/config/db";

export default async function upViews(req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ message: "Not Allowed!" });

  if (req.body === null || "")
    return res.status(403).json({ message: "Not Allowed!" });

  const { id } = req.body;

  try {
    const queryGet = await execQuery(
      "SELECT media_views FROM medias WHERE uid = ?",
      [id],
    );

    const currentViews = queryGet[0].media_views;
    const increment = currentViews + 1;

    const query = execQuery(
      "UPDATE medias SET media_views = ?  WHERE uid = ?",
      [increment, id],
    );

    // res.status(200).json({
    //   error: 0,
    //   data: queryGet[0].media_views,
    // });

    return res.status(200).json({
      error: 0,
      message: "success",
    });
  } catch (err) {
    return res.status(400).json({ error: 1, message: err });
  }
}
