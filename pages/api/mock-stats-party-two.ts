import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json({
    turn_out: 8789994,
    percent_turn_out: 16.49859,
    party_list_turn_out: 7883169,
    party_list_percent_turn_out: 14.78511,
  });
}
