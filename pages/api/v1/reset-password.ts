import bcryptjs from "bcryptjs";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { EnvGetter } from "../../../lib/env-getter";
import { databaseNameV1, saltRounds } from "../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  try {
    if (req.method !== "POST") throw new Error("wrong method");

    // DATA PREPARATION
    const { username, oldPassword, newPassword } = req.body;
    if (!username || !oldPassword || !newPassword)
      throw new Error("some required fields are missing.");

    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(databaseNameV1);
    const collection = db.collection("admin");

    // CHECK IF ACCOUNT EXISTS
    const adminUser = await collection.findOne({ username: username });
    if (adminUser === null) throw new Error("user not found");

    // CHECK IF QUOTA EXCEEDED
    if (adminUser.incorrectPasswordTimes >= 10)
      throw new Error("incorrect password quota exceeded");

    // CHECK DATA COMPLETENESS RETURNED FROM DB
    if (!adminUser.password)
      throw new Error("some data in admin account is missing.");

    // CHECK OLD PASSWORD WITH BCRYPTJS
    const {
      password: adminHashedPassword,
    } = adminUser;
    const comparing = await bcryptjs.compare(oldPassword, adminHashedPassword);

    // IF WRONG PASSWORD COUNT IT
    if (comparing === false) {
      const newIncorrectPasswordCount =
        adminUser.incorrectPasswordTimes + 1 || 1;
      await collection.updateOne(
        { username: username },
        { $set: { incorrectPasswordTimes: newIncorrectPasswordCount } }
      );

      throw new Error("incorrect old password");
    }

    // HASH NEW PASSWORD
    const hashedNewPassword = await bcryptjs.hash(newPassword, saltRounds);


    // UPDATE PASSWORD AND RESET INCORRECT PASSWORD TIMES
    await collection.updateOne(
      { username: username },
      {
        $set: {
          password: hashedNewPassword,
          incorrectPasswordTimes: 0,
        },
      }
    );

    // CLOSE DB AND RESPONSE
    client.close();
    res.status(200).json({ message: "password reset successfully" });
  } catch (error) {
    const err = error as Error;

    // CLOSE DB BEFORE RESPONSE
    if (connectClient) client.close();

    if (err.message === "incorrect password quota exceeded") res.status(403);
    else res.status(400);
    res.json({ message: err.message });
  }
}
