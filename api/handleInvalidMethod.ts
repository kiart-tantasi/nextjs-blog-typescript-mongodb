import { NextApiResponse } from "next";

export function handleInvalidMethod(res: NextApiResponse) {
  return res.status(400).json({ message: "no matching method." });
}
