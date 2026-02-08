import { NextPage } from "next";

import { publicDomain, statsPartyUrl, statsPartyUrl2 } from "../config";
import { ElectionPartyInfo } from "../utils/election-info";

interface Candidate {
  mp_app_id: string;
  mp_app_vote: number;
  mp_app_vote_percent: number;
  mp_app_rank: number;
  party_id: number;
}

interface PartyResult {
  party_id: number;
  party_vote: number;
  party_vote_percent: number;
  party_list_count: number | null;
  mp_app_vote: number;
  mp_app_vote_percent: number;
  first_mp_app_count: number;
  candidates: Candidate[] | null;
}

interface PartyData {
  counted_vote_stations: number;
  percent_count: number;
  result_party: PartyResult[];
  last_update: string;
}

interface PartDataTwo {
  turn_out: number;
  percent_turn_out: number;
  party_list_turn_out: number;
  party_list_percent_turn_out: number;
}

interface ElectionProps {
  data: {
    top_mp_app_votes: PartyResult[] | null;
    top_party_votes: PartyResult[] | null;
    metadata: PartDataTwo | null;
  };
}

const Election: NextPage<ElectionProps> = (props: ElectionProps) => {
  const allPossiVotes = 52_922_923;
  const metadata = props.data.metadata;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2.5rem",
        padding: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ flex: 1, minWidth: "320px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#1a202c",
            borderLeft: "4px solid #3182ce",
            paddingLeft: "1rem",
          }}
        >
          แบ่งเขต
        </h2>
        {metadata && (
          <div
            style={{
              backgroundColor: "#f7fafc",
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "2rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#718096",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  จำนวนผู้มาใช้สิทธิ
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.4rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: "#2d3748",
                      lineHeight: 1,
                    }}
                  >
                    {metadata.turn_out.toLocaleString()}
                  </span>
                  <span
                    style={{
                      color: "#a0aec0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    / {allPossiVotes.toLocaleString()} คน
                  </span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#3182ce",
                  }}
                >
                  {metadata.percent_turn_out}%
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#718096",
                    fontWeight: 600,
                  }}
                >
                  ของทั้งหมด
                </span>
              </div>
            </div>
            <div
              style={{
                height: "10px",
                backgroundColor: "#edf2f7",
                borderRadius: "5px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: `${metadata.percent_turn_out}%`,
                  height: "100%",
                  backgroundColor: "#3182ce",
                  backgroundImage:
                    "linear-gradient(90deg, #3182ce 0%, #63b3ed 100%)",
                  borderRadius: "5px",
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {props.data.top_mp_app_votes?.map((party) => (
            <div
              key={party.party_id}
              style={{
                padding: "1.25rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "transform 0.2s",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#2d3748",
                }}
              >
                {ElectionPartyInfo[party.party_id.toString()]?.name ||
                  "ไม่พบชื่อพรรค"}
              </p>
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {party.first_mp_app_count} ที่นั่ง&nbsp;
                  <span style={{ color: "#4a5568", fontSize: "12px" }}>
                    ({party.mp_app_vote.toLocaleString()} คะแนน)
                  </span>
                </span>
                <span
                  style={{
                    backgroundColor: "#ebf8ff",
                    color: "#2b6cb0",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {party.mp_app_vote_percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: "320px" }}>
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1.5rem",
            color: "#1a202c",
            borderLeft: "4px solid #805ad5",
            paddingLeft: "1rem",
          }}
        >
          ปาร์ตี้ลิสต์
        </h2>
        {metadata && (
          <div
            style={{
              backgroundColor: "#f7fafc",
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "2rem",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "0.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    color: "#718096",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  จำนวนผู้มาใช้สิทธิ
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "0.4rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: "#2d3748",
                      lineHeight: 1,
                    }}
                  >
                    {metadata.party_list_turn_out.toLocaleString()}
                  </span>
                  <span
                    style={{
                      color: "#a0aec0",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    / {allPossiVotes.toLocaleString()} คน
                  </span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "#805ad5",
                  }}
                >
                  {metadata.party_list_percent_turn_out}%
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "#718096",
                    fontWeight: 600,
                  }}
                >
                  ของทั้งหมด
                </span>
              </div>
            </div>
            <div
              style={{
                height: "10px",
                backgroundColor: "#edf2f7",
                borderRadius: "5px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: `${metadata.party_list_percent_turn_out}%`,
                  height: "100%",
                  backgroundColor: "#805ad5",
                  backgroundImage:
                    "linear-gradient(90deg, #805ad5 0%, #b794f4 100%)",
                  borderRadius: "5px",
                  transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {props.data.top_party_votes?.map((party) => (
            <div
              key={party.party_id}
              style={{
                padding: "1.25rem",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                transition: "transform 0.2s",
                border: "1px solid #e2e8f0",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#2d3748",
                }}
              >
                {ElectionPartyInfo[party.party_id.toString()]?.name ||
                  "ไม่พบชื่อพรรค"}
              </p>
              <div
                style={{
                  marginTop: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  {Math.floor(party.party_vote_percent)} ที่นั่ง&nbsp;
                  <span style={{ color: "#4a5568", fontSize: "12px" }}>
                    ({party.party_vote.toLocaleString()} คะแนน)
                  </span>
                </span>
                <span
                  style={{
                    backgroundColor: "#faf5ff",
                    color: "#6b46c1",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {party.party_vote_percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Election;

export async function getStaticProps() {
  let data: PartyData | null = null;
  let top_party_votes: PartyResult[] | null = null;
  let top_mp_app_votes: PartyResult[] | null = null;
  try {
    console.log(`[DEBUG] [statsPartyUrl] url: ${statsPartyUrl}`);
    const res = await fetch(statsPartyUrl);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `[statsPartyUrl] Response is not okay with status code ${res.status}\nResponse body: ${body}`,
      );
    }
    data = (await res.json()) as PartyData;

    // Transform data into a new json that has two arrays
    // 1. top 10 parties that get the most representatives
    // 2. top 10 parties that get party_vote the most
    top_mp_app_votes = data.result_party
      .sort((a, b) => b.first_mp_app_count - a.first_mp_app_count)
      .slice(0, 10)
      .map((x) => ({ ...x, candidates: null }));
    top_party_votes = data.result_party
      .sort((a, b) => b.party_vote - a.party_vote)
      .slice(0, 10)
      .map((x) => ({ ...x, candidates: null }));
  } catch (err) {
    console.log(err);
  }

  let metadata: PartDataTwo | null = null;
  try {
    console.log(`[DEBUG] [statsPartyUrl2] url: ${statsPartyUrl2}`);
    const res2 = await fetch(statsPartyUrl2);
    if (!res2.ok) {
      const body = await res2.text();
      throw new Error(
        `[statsPartyUrl2] Response is not okay with status code ${res2.status}\nResponse body: ${body}`,
      );
    }
    metadata = (await res2.json()) as PartDataTwo;
  } catch (err) {
    console.log(err);
  }

  return {
    props: {
      data: {
        top_party_votes,
        top_mp_app_votes,
        metadata,
      },
    },
    // Cache for 20 seconds
    revalidate: 20,
  };
}
