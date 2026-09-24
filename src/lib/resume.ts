import { getCollection, type CollectionEntry } from 'astro:content';
import { PUBLISHED_VERSION } from '../config';

export type Resume = CollectionEntry<'resumes'>['data'];
export type Experience = Resume['experience'][number];
export type Role = Experience['roles'][number];
export type Project = Resume['projects'][number];

export interface ResumeVersion {
  /** `YYYY-MM`, taken from the file name. */
  id: string;
  version: number;
  /** e.g. "Sep 2026" */
  label: string;
  /** True for the version the site publishes (see src/config.ts). */
  isPublished: boolean;
  data: Resume;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(ym: string): string {
  if (ym === 'present') return 'Present';
  const [year, month] = ym.split('-');
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

export function formatRange(start: string, end: string): string {
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

/** A company's span across all of its roles. */
export function companyRange(exp: Experience): string {
  const starts = exp.roles.map((r) => r.start).sort();
  const ends = exp.roles.map((r) => r.end);
  const end = ends.includes('present') ? 'present' : ends.sort().at(-1)!;
  return formatRange(starts[0], end);
}

const NBSP = '\u00a0';
/** Non-breaking spaces around → and × keep "659 → 582" and "Shop × Tokopedia" on one line. */
export const glueSymbols = (text: string) =>
  text.replaceAll(' → ', `${NBSP}→${NBSP}`).replaceAll(' × ', `${NBSP}×${NBSP}`);

/** Splits `**bold**` markup into plain/emphasised segments. */
export function parseEmphasis(text: string): { text: string; strong: boolean }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**')
        ? { text: part.slice(2, -2), strong: true }
        : { text: part, strong: false },
    );
}


/** All versions, newest first. Fails the build on malformed or duplicate versions, or a bad PUBLISHED_VERSION. */
export async function getVersions(): Promise<ResumeVersion[]> {
  const entries = await getCollection('resumes');
  if (entries.length === 0) throw new Error('No resume versions found in src/data/resumes');

  const seen = new Map<number, string>();
  for (const entry of entries) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(entry.id)) {
      throw new Error(`Resume file "${entry.id}" must be named YYYY-MM.yaml`);
    }
    const clash = seen.get(entry.data.version);
    if (clash) throw new Error(`Resume ${entry.id} and ${clash} both claim version ${entry.data.version}`);
    seen.set(entry.data.version, entry.id);
  }

  const published = PUBLISHED_VERSION === 'latest' ? null : PUBLISHED_VERSION;
  if (published && !entries.some((e) => e.id === published)) {
    throw new Error(`PUBLISHED_VERSION "${published}" in src/config.ts has no src/data/resumes/${published}.yaml`);
  }

  const sorted = entries.sort((a, b) => b.data.version - a.data.version);
  return sorted.map((entry, i) => ({
    id: entry.id,
    version: entry.data.version,
    label: formatMonth(entry.id),
    isPublished: published ? entry.id === published : i === 0,
    data: entry.data,
  }));
}

/** The version the site serves at / and /resume.pdf. */
export async function getPublished(): Promise<ResumeVersion> {
  return (await getVersions()).find((v) => v.isPublished)!;
}

export type PdfVariant = 'full' | 'compact';

/** Page budget per PDF variant (guidelines/RESUME-BEST-PRACTICE-CONTENT.md § Structure). */
export const PDF_MAX_PAGES: Record<PdfVariant, number> = { full: 2, compact: 1 };

/** Download name, e.g. Agas-Yanpratama-Resume-2026-09.pdf or …-2026-09-1-page.pdf */
export function pdfFileName(v: ResumeVersion, variant: PdfVariant = 'full'): string {
  const name = v.data.profile.name.replace(/\s+/g, '-');
  return `${name}-Resume-${v.id}${variant === 'compact' ? '-1-page' : ''}.pdf`;
}

/** The bullets the 1-page PDF keeps, from a `compact: [1, 3]` pick (1-based). */
export function compactBullets(bullets: string[], pick: number[] | undefined, where: string): string[] {
  if (!pick) return bullets.slice(0, 1);
  if (new Set(pick).size !== pick.length) throw new Error(`${where}: compact picks repeat a bullet (${pick.join(', ')})`);
  return pick.map((n) => {
    const bullet = bullets[n - 1];
    if (bullet === undefined) throw new Error(`${where}: compact pick ${n} is out of range (1–${bullets.length})`);
    return bullet;
  });
}

/** Profile links are stored without a scheme (linkedin.com/in/…); this adds it. */
export const profileUrl = (handle: string) => (handle.startsWith('http') ? handle : `https://${handle}`);
