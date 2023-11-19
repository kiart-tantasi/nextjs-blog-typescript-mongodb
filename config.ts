import { Status } from "./interfaces/article";

export const databaseNameV1 = "blogDB";

export const databaseNameV2 = process.env.OVERRIDING_DB ?? "blog";

export const abTests = {
  isApiV2: false,
};

export const allowedCategoriesV2 = ["general", "tech", "lifestyle"];

export const allowedStatusForRecoveringV2 = [Status.WORKSPACE, Status.PUBLIC];
