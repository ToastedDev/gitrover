import { defineCollection, reference, z } from "astro:content";

export const collections = {
  docs: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      category: reference("category").optional(),
      sort: z.number().optional(),
    }),
  }),
  category: defineCollection({
    type: "data",
    schema: z.object({
      name: z.string(),
      sort: z.number().optional(),
    }),
  }),
};
