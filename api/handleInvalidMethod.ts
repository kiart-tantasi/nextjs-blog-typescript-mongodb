import { NextApiResponse } from "next";

export function handleInvalidMethod(res: NextApiResponse) {
  return res.status(404).json({ message: "no matching method." });
}
