import { execQuery } from "@/config/db";

export default async function upDownloads(req, res) {
  if (req.method !== "POST")
    return res.status(403).json({ message: "Not Allowed!" });

  if (req.body === null || "")
    return res.status(403).json({ message: "Not Allowed!" });

  const { id } = req.body;

  try {
    const queryGet = await execQuery(
      "SELECT media_download FROM medias WHERE id = ?",
      [id],
    );

    const currentDownload = queryGet[0].media_download;
    const increment = currentDownload + 1;

    const query = execQuery(
      "UPDATE medias SET media_download = ?  WHERE id = ?",
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
