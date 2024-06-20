import React from "react";
import usersValidator from "@/common/usersValidation";
import { execQuery } from "@/config/db";
import moment from "moment";

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

    // SIGNUP PROCCESS
    // #CHECK USERS AVAILABLE
    const query = await execQuery(
      `SELECT email FROM users WHERE email = '${email}'`,
      []
    );

    if (query.length === 0) {
      //res.status(200).json({available: 1,message: `Yeay! ${email} is available for register!`})

      const dateNow = moment().format();
      const uuid = require("crypto").randomUUID().toString();
      const bcrypt = require("bcryptjs");
      const enc = bcrypt.genSaltSync(10);
      const finalEnc = bcrypt.hashSync(pwd, enc);

      const queryReg = await execQuery(
        `INSERT INTO users (uid, email, password, createdDate) VALUES (?,?,?,?)`,
        [uuid, email, finalEnc, dateNow]
      );
      let { affectedRows } = queryReg;

      if (affectedRows === 1)
        return res.status(200).json({
          available: 1,
          status: 1,
          message: `Yeay! ${email} successfully registered!`,
        });
    } else {
      return res
        .status(200)
        .json({
          available: 0,
          error: 1,
          message: `Uh-No! ${email} already registered!`,
        });
    }
  } catch (errs) {
    return res.status(403).json({ message: errs });
  }
}
