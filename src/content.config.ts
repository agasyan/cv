import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** `YYYY-MM`, e.g. `2026-09`. */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM');
const monthOrPresent = z.union([month, z.literal('present')]);

const role = z.object({
  title: z.string(),
  team: z.string().optional(),
  /** Small web-only tag next to the title, e.g. "Promoted". Not printed in the PDF. */
  badge: z.string().optional(),
  start: month,
  end: monthOrPresent,
  /** `**text**` renders as emphasis on the web and bold in the PDF. */
  bullets: z.array(z.string()).min(1),
  /** Bullets (1-based) the 1-page PDF keeps. Default: the first one. `[]` keeps none. */
  compact: z.array(z.number().int().positive()).optional(),
});

const resumes = defineCollection({
  // One file per version, named after the month it was published: src/data/resumes/2026-09.yaml
  loader: glob({ pattern: '*.yaml', base: './src/data/resumes' }),
  schema: z.object({
    version: z.number().int().positive(),
    /** What changed versus the previous version. Kept in the file as the changelog; not rendered. */
    changes: z.array(z.string()).default([]),
    profile: z.object({
      name: z.string(),
      headline: z.string(),
      email: z.email(),
      linkedin: z.string(),
      github: z.string().optional(),
      location: z.string(),
    }),
    summary: z.string(),
    /** Shorter summary for the 1-page PDF. Falls back to `summary`. */
    summaryCompact: z.string().optional(),
    /** Headline numbers for the web hero. Only reuse figures already stated in the bullets. */
    highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
    experience: z
      .array(
        z.object({
          company: z.string(),
          descriptor: z.string().optional(),
          location: z.string(),
          /** Main technologies used there, shown under the company. Backs the skills list. */
          stack: z.array(z.string()).optional(),
          roles: z.array(role).min(1),
        }),
      )
      .min(1),
    /** Side projects. `stack` renders as one line; bullets follow the same XYZ rules as roles. */
    projects: z
      .array(
        z.object({
          name: z.string(),
          tagline: z.string(),
          url: z.string().optional(),
          start: month,
          end: monthOrPresent,
          stack: z.array(z.string()).min(1),
          bullets: z.array(z.string()).min(1),
          compact: z.array(z.number().int().positive()).optional(),
        }),
      )
      .default([]),
    education: z.array(
      z.object({
        school: z.string(),
        degree: z.string(),
        gpa: z.string().optional(),
        start: z.number().int(),
        end: z.number().int(),
      }),
    ),
    publications: z.array(z.object({ title: z.string(), venue: z.string() })).default([]),
    certifications: z.array(z.string()).default([]),
    skills: z
      .array(
        z.object({
          group: z.string(),
          items: z.array(z.string()).min(1),
          /** `false` leaves the group out of the 1-page PDF. */
          compact: z.boolean().optional(),
        }),
      )
      .min(1),
  }),
});

export const collections = { resumes };
