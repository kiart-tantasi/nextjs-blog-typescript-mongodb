import { Status } from "./interfaces/article";

const numberOrNull = (k: string): number | null => {
  const val = process.env[k];
  if (!val) {
    return null;
  }
  const num = parseInt(val);
  if (isNaN(num)) {
    throw new Error(`value of ${k} must be a valid number`);
  }
  return num;
}

export const databaseNameV1 = "blogDB";

export const saltRounds: number = numberOrNull("SALT_ROUNDS") || 10;

export const databaseNameV2 = process.env.OVERRIDING_DB ?? "blog";

export const abTests = {
  isApiV2: false,
};

export const allowedCategoriesV1 = [
  "tech",
  "gaming",
  "workoutandhealth",
  "others",
  "workspace",
];

export const allowedCategoriesV2 = ["general", "tech", "lifestyle"];

export const allowedStatusForRecoveringV2 = [Status.WORKSPACE, Status.PUBLIC];

export const publicDomain =
  process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000";

export const authorName = process.env.NEXT_PUBLIC_AUTHOR || "ไม่ระบุนาม";

export const websiteNameLocal = "เพชรบล็อก";

export const websiteNameEnglish = "petchblog";

export const tempLastModified = 1700611200000; // temporarily for sitemap

export const statsPartyUrl = process.env.STATS_PARTY_URL || "";

export const statsPartyUrl2 = process.env.STATS_PARTY_URL_2 || "";
