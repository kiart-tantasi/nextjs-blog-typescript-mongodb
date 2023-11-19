import { Status } from "./interfaces/article";

export const databaseNameV1 = "blogDB";

export const databaseNameV2 = process.env.OVERRIDING_DB ?? "blog";

export const abTests = {
  isApiV2: false,
};

export const allowedCategoriesV1 = ['tech', 'gaming', 'workoutandhealth', 'others', 'workspace']

export const allowedCategoriesV2 = ["general", "tech", "lifestyle"];

export const allowedStatusForRecoveringV2 = [Status.WORKSPACE, Status.PUBLIC];

export const websiteNameLocal = 'เพชรบล็อก'

export const websiteNameEnglish = 'petchblog'
