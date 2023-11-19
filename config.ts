import { Status } from "./interfaces/article";

export const databaseNameV1 = "blogDB";

export const databaseNameV2 = process.env.OVERRIDING_DB ?? "blog";

export const abTests = {
  isApiV2: false,
};

export const allowedCategoriesV1 = ['tech', 'gaming', 'workoutandhealth', 'others', 'workspace']

export const allowedCategoriesV2 = ["general", "tech", "lifestyle"];

export const allowedStatusForRecoveringV2 = [Status.WORKSPACE, Status.PUBLIC];

export const publicDomain = process.env.NEXT_PUBLIC_DOMAIN || "http://localhost:3000"

export const authorName = process.env.NEXT_PUBLIC_AUTHOR || 'ไม่ระบุนาม'

export const websiteNameLocal = 'เพชรบล็อก'

export const websiteNameEnglish = 'petchblog'
