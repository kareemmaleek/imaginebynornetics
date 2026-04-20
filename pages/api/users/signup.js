import usersValidator from "@/common/usersValidation";
import { execQuery } from "@/config/db";
import { generateUsername } from "@/common/usernameGenerator";

export default async function signup(req, res) {
  try {
    if (req.method !== "POST")
      return res.status(403).json({ message: "Not Allowed!" });

    const data = req.body;
    const { email, pwd, confirmPwd } = data;

    let { error } = usersValidator(data);

    if (error) {
      return res
        .status(200)
        .json({ error: 1, message: error.details[0].message });
    }

    // CHECK IF EMAIL ALREADY EXISTS
    const query = await execQuery(
      "SELECT email FROM users WHERE email = ?",
      [email],
    );

    if (query.length === 0) {
      const uuid = require("crypto").randomUUID().toString();
      const bcrypt = require("bcryptjs");
      const enc = bcrypt.genSaltSync(10);
      const finalEnc = bcrypt.hashSync(pwd, enc);

      // Generate unique username
      let username = generateUsername();
      let usernameExists = true;
      let attempts = 0;

      while (usernameExists && attempts < 10) {
        const checkUsername = await execQuery(
          "SELECT username FROM users WHERE username = ?",
          [username],
        );
        if (checkUsername.length === 0) {
          usernameExists = false;
        } else {
          username = generateUsername();
          attempts++;
        }
      }

      const queryReg = await execQuery(
        "INSERT INTO users (uid, email, password, username) VALUES (?,?,?,?)",
        [uuid, email, finalEnc, username],
      );
      let { affectedRows } = queryReg;

      if (affectedRows === 1)
        return res.status(200).json({
          available: 1,
          status: 1,
          message: `Yeay! ${email} successfully registered!`,
        });
    } else {
      return res.status(200).json({
        available: 0,
        error: 1,
        message: `Uh-No! ${email} already registered!`,
      });
    }
  } catch (errs) {
    console.error("Signup error:", errs);
    return res.status(403).json({ message: errs });
  }
}
