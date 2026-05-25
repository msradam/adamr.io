import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const writingsSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
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
