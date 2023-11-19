import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

import { setTokenCookie } from "../../../lib/auth-cookie";
import { EnvGetter } from "../../../lib/env-getter";
import { databaseNameV1 } from "../../../config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // DECLARE IT HERE BECAUSE IT NEEDS TO BE CLOSED IN CATCH(ERROR) IF AN ERROR IS THROWN
  const dbUrl = EnvGetter.getDbUrl();
  const client = new MongoClient(dbUrl);
  let connectClient = false;

  try {
    if (req.method !== "POST") throw new Error("wrong method");

    // DATA PREPARATION
    const { username, password } = req.body;
    if (!username || !password) throw new Error("some information is missing.");

    // AUTHENTICATE ROOT USER
    const isRootUserEnabled =
      process.env.ROOT_ENABLE === "true" &&
      process.env.ROOT_USERNAME !== undefined &&
      process.env.ROOT_PASSWORD !== undefined;
    if (
      isRootUserEnabled &&
      username === process.env.ROOT_USERNAME &&
      password === process.env.ROOT_PASSWORD
    ) {
      const token = authenticate({
        res,
        adminUsername: "root",
        adminFirstName: "root",
        adminLastName: "root",
      });
      res
        .status(200)
        .json({ message: "registered successfully (root user)", token });
      return;
    }

    // CONNECT DB
    await client.connect();
    connectClient = true;
    const db = client.db(databaseNameV1);
    const collection = db.collection("admin");

    // CHECK IF ACCOUNT EXISTS
    const adminUser = await collection.findOne({ username: username });
    if (adminUser === null) throw new Error("user not found");
    if (adminUser.incorrectPasswordTimes === 10)
      throw new Error("incorrect password quota exceeded");

    // CHECK DATA COMPLETENESS RETURNED FROM DB
    const {
      username: adminUsername,
      password: adminHashedPassword,
      firstName: adminFirstName,
      lastName: adminLastName,
    } = adminUser;
    if (
      !adminUsername ||
      !adminHashedPassword ||
      !adminFirstName ||
      !adminLastName
    )
      throw new Error("some data in admin account is missing.");

    // CHECK PASSWORD WITH BCRYPTJS
    const comparing = await bcryptjs.compare(password, adminHashedPassword);

    // IF WRONG PASSWORD COUNT IT
    if (comparing === false) {
      const newIncorrectPasswordCount =
        adminUser.incorrectPasswordTimes + 1 || 1;
      await collection.updateOne(
        { username: username },
        { $set: { incorrectPasswordTimes: newIncorrectPasswordCount } }
      );
      throw new Error("incorrect password");
    }

    // IF PASSWORD IS CORRECT, RESET TIMES OF INCORRECT PASSWORD TO ZERO
    await collection.updateOne(
      { username: username },
      { $set: { incorrectPasswordTimes: 0 } }
    );

    // AUTHENTICATE
    const token = authenticate({
      res,
      adminUsername,
      adminFirstName,
      adminLastName,
    });

    // CLOSE DB AND RESPONSE
    client.close();
    res.status(200).json({ message: "registered successfully", token });
  } catch (error) {
    const err = error as Error;

    // CLOSE DB BEFORE RESPONSE 400 IN SOME CASES
    if (connectClient) client.close();
    if (err.message === "incorrect password quota exceeded") res.status(403);
    else res.status(400);
    res.json({ message: err.message });
  }
}

interface AuthenticateProps {
  res: NextApiResponse;
  adminUsername: string;
  adminFirstName: string;
  adminLastName: string;
}
function authenticate({
  res,
  adminUsername,
  adminFirstName,
  adminLastName,
}: AuthenticateProps): string {
  const token = jwt.sign(
    {
      data: {
        adminUsername,
        adminFirstName,
        adminLastName,
      },
      exp: Math.floor((Date.now() + 7_200_000) / 1000), // 2 hours
      // iat will be automatically set
    },
    EnvGetter.getPrivateKey()
  );
  setTokenCookie(res, token);
  return token;
}
