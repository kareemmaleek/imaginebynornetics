const moment = require("moment");

export default function hash(req, res) {
  const token2 = require("crypto");
  const generated = token2.randomBytes(32).toString("hex");
  const dateNow = moment().format();
  return res.send(dateNow);
}
