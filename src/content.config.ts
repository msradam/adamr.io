import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/* Tags are folded to lowercase at load. Authors write them either as a YAML
   list or an inline array, and a stray capital used to fork a topic into two
   tags ("AI" and "ai") that render identically and, on a case-insensitive
   filesystem, collide into one page that silently drops the other's posts. */
const tagList = z
  .array(z.string())
  .optional()
  .transform((tags) =>
    tags ? [...new Set(tags.map((t) => t.trim().toLowerCase()))] : tags,
  );

const writingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  tags: tagList,
  topic: z.enum(["ai-infra", "observability", "essays"]).optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: writingsSchema,
});

const dev = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/dev" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    hidden: z.boolean().optional(),
    active: z.boolean().optional(),
    featured: z.boolean().optional(),
    featuredRank: z.number().optional(),
    role: z.string().optional(),
    stack: z.array(z.string()).optional(),
    venue: z.string().optional(),
    recognition: z.string().optional(),
    demoURL: z.string().optional(),
    repoURL: z.string().optional(),
    excerpt: z.string().optional(),
  }),
});

export const collections = { blog, dev };
