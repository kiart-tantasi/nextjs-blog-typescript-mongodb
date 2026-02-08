import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return res.status(200).json({
    counted_vote_stations: 7596,
    percent_count: 7.56303,
    result_party: [
      {
        party_id: 900,
        party_vote: 512,
        party_vote_percent: 0.1234,
        party_list_count: null,
        mp_app_vote: 674,
        mp_app_vote_percent: 0.5678,
        first_mp_app_count: 3,
      },
      {
        party_id: 901,
        party_vote: 893,
        party_vote_percent: 0.1234,
        party_list_count: null,
        mp_app_vote: 263,
        mp_app_vote_percent: 0.5678,
        first_mp_app_count: 7,
      },
      {
        party_id: 902,
        party_vote: 746,
        party_vote_percent: 0.1234,
        party_list_count: null,
        mp_app_vote: 100,
        mp_app_vote_percent: 0.5678,
        first_mp_app_count: 3,
      },
    ],
    last_update: "2026-02-08T11:43:31.492Z",
  });
}
