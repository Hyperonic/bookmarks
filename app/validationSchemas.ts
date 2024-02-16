import { z } from "zod";

export const bookmarksSchema = z.object({
    categoryId: z.string(),
    name: z.string().min(1,  "Name is required."),
    link: z.string().min(1,  "Link is required.").url(),
});
