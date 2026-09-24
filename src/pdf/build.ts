/**
 * Renders a resume version to an ATS-safe PDF: A4, single column, real selectable text,
 * no tables or text boxes. Fonts are embedded Source Sans 3 and Source Serif 4 (OFL).
 * Styling follows guidelines/DESIGN.md § PDF.
 */
import path from 'node:path';
import pdfmake from 'pdfmake';
import type { Content, ContentText, TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  compactBullets,
  companyRange,
  formatRange,
  glueSymbols,
  parseEmphasis,
  PDF_MAX_PAGES,
  profileUrl,
  type Experience,
  type PdfVariant,
  type Project,
  type ResumeVersion,
  type Role,
} from '../lib/resume';

// Resolved from the project root (injected at build time): Astro bundles this file, so import.meta.url is not stable.
const FONT_DIR = path.resolve(__PROJECT_ROOT__, 'src/pdf/fonts');
const font = (file: string) => path.join(FONT_DIR, file);

pdfmake.setFonts({
  Sans: {
    normal: font('SourceSans3-400-normal.ttf'),
    bold: font('SourceSans3-700-normal.ttf'),
    italics: font('SourceSans3-400-italic.ttf'),
    bolditalics: font('SourceSans3-700-normal.ttf'),
  },
  SansSemiBold: {
    normal: font('SourceSans3-600-normal.ttf'),
    bold: font('SourceSans3-700-normal.ttf'),
    italics: font('SourceSans3-600-normal.ttf'),
    bolditalics: font('SourceSans3-700-normal.ttf'),
  },
  Serif: {
    normal: font('SourceSerif4-600-normal.ttf'),
    bold: font('SourceSerif4-600-normal.ttf'),
    italics: font('SourceSerif4-600-normal.ttf'),
    bolditalics: font('SourceSerif4-600-normal.ttf'),
  },
});
pdfmake.setUrlAccessPolicy(() => false);
pdfmake.setLocalAccessPolicy((p) => p.startsWith(FONT_DIR));

const PAGE_MARGIN_X = 46;
const CONTENT_WIDTH = 595.28 - PAGE_MARGIN_X * 2; // A4 width in pt
const INK = '#2b2a27';
const MUTED = '#5f5e57';
const ACCENT = '#0f766e';
const RULE = '#ddd8cb';
const SEP = '  ·  ';

// The 1-page variant is denser: smaller type, tighter margins and section spacing.
const LAYOUT = {
  full: { fontSize: 9.8, lineHeight: 1.1, marginY: 36, headingSize: 12.5, headingTop: 8, ruleGap: 4.5, bulletGap: 1.5, entryGap: 6 },
  compact: { fontSize: 9.2, lineHeight: 1.05, marginY: 28, headingSize: 11.5, headingTop: 6, ruleGap: 3, bulletGap: 1, entryGap: 4 },
} as const;
let layout: (typeof LAYOUT)[keyof typeof LAYOUT] = LAYOUT.full;

export interface PdfOptions {
  /** `full` is at most 2 pages, `compact` exactly 1 (fewer bullets, shorter summary). Default `full`. */
  variant?: PdfVariant;
  /** Printed in the contact line. Only passed for local downloads, never for the public PDF. */
  phone?: string;
}

const NBSP = '\u00a0';
/** A " · " list that wraps only between items ("GitHub Actions" never splits). */
const inlineList = (items: string[]) => items.map((i) => i.replaceAll(' ', NBSP)).join(' · ');

// Metrics are bold and never wrap inside ("100+ RPS" stays on one line).
const rich = (text: string): ContentText['text'] =>
  parseEmphasis(text).map((s) => (s.strong ? { text: s.text.replaceAll(' ', NBSP), bold: true } : glueSymbols(s.text)));

const stackLine = (items: string[]): Content => ({ text: `Stack: ${inlineList(items)}`, color: MUTED, fontSize: 9.2 });

// Each bullet is its own unbreakable block, so no bullet splits across a page break.
// The marker is a real "•" character, which ATS parsers use to detect list items.
const bullet = (content: ContentText['text'], marginTop = 0): Content => ({
  stack: [
    {
      columns: [
        { width: 9, text: '•', color: MUTED },
        { width: '*', text: content },
      ],
    },
  ],
  unbreakable: true,
  margin: [6, marginTop, 0, layout.bulletGap],
});

const bulletList = (bullets: string[], first: boolean): Content[] =>
  bullets.map((b, i) => bullet(rich(b), first && i === 0 ? 2.5 : 0));

const dated = (left: Content, date: string): Content => ({
  columns: [
    { width: '*', stack: [left] },
    { width: 'auto', text: date, fontSize: 9.2, color: MUTED, margin: [8, 1.2, 0, 0] },
  ],
});

function section(title: string, blocks: Content[]): Content[] {
  const heading: Content[] = [
    { text: title, font: 'Serif', fontSize: layout.headingSize, margin: [0, layout.headingTop, 0, 2] },
    {
      canvas: [{ type: 'line', x1: 0, y1: 0, x2: CONTENT_WIDTH, y2: 0, lineWidth: 0.6, lineColor: RULE }],
      margin: [0, 0, 0, layout.ruleGap],
    },
  ];
  if (blocks.length === 0) return [];
  const [first, ...rest] = blocks;
  // Keep the heading on the same page as its first entry.
  return [{ stack: [...heading, first], unbreakable: true }, ...rest];
}

function roleTitle(role: Role): Content {
  return {
    text: [{ text: role.title, font: 'SansSemiBold' }, ...(role.team ? [{ text: `, ${role.team}` }] : [])],
    fontSize: 10.2,
  };
}

function experienceBlocks(exp: Experience, index: number, compact: boolean): Content[] {
  const place = [exp.descriptor, exp.location].filter(Boolean).join(' · ');
  const companyLine = dated(
    { text: [{ text: exp.company, font: 'Serif', fontSize: 11 }, { text: `${SEP}${place}`, color: MUTED, fontSize: 9.4 }] },
    companyRange(exp),
  );
  const stack: Content[] = exp.stack && !compact ? [stackLine(exp.stack)] : [];
  const multiRole = exp.roles.length > 1;

  return exp.roles.flatMap((role, r) => {
    const title = multiRole ? dated(roleTitle(role), formatRange(role.start, role.end)) : roleTitle(role);
    const bullets = compact ? compactBullets(role.bullets, role.compact, `${exp.company}, ${role.title}`) : role.bullets;
    const [firstBullet, ...restBullets] = bullets;
    // Company + role header + first bullet never split across pages.
    const head: Content = {
      stack: [
        ...(r === 0 ? [companyLine, ...stack] : []),
        { stack: [title], margin: [0, r === 0 ? 1.5 : 6, 0, 0] },
        ...(firstBullet ? bulletList([firstBullet], true) : []),
      ],
      unbreakable: true,
      margin: [0, r === 0 && index > 0 ? layout.entryGap : 0, 0, 0],
    };
    return [head, ...bulletList(restBullets, false)];
  });
}

function projectBlocks(p: Project, index: number, compact: boolean): Content[] {
  const bullets = compact ? compactBullets(p.bullets, p.compact, p.name) : p.bullets;
  const [firstBullet, ...restBullets] = bullets;
  const head: Content = {
    stack: [
      dated(
        { text: [{ text: p.name, font: 'Serif', fontSize: 11, ...(p.url ? { link: profileUrl(p.url) } : {}) }] },
        formatRange(p.start, p.end),
      ),
      ...(compact ? [] : [{ text: p.tagline, color: MUTED, margin: [0, 1, 0, 0] } as Content]),
      ...(firstBullet ? bulletList([firstBullet], true) : []),
    ],
    unbreakable: true,
    margin: [0, index > 0 ? layout.entryGap : 0, 0, 0],
  };
  return [head, ...bulletList(restBullets, false), { stack: [stackLine(p.stack)], margin: [15, 1, 0, 0] }];
}

function referenceTitle(publications: number, certifications: number): string {
  const pubs = publications > 1 ? 'Publications' : 'Publication';
  if (publications && certifications) return `${pubs} and certifications`;
  return publications ? pubs : 'Certifications';
}

function buildDocDefinition(v: ResumeVersion, options: PdfOptions = {}): TDocumentDefinitions {
  const { profile, experience, projects, education, publications, certifications, skills } = v.data;
  const compact = options.variant === 'compact';
  layout = LAYOUT[compact ? 'compact' : 'full'];
  const summary = compact ? (v.data.summaryCompact ?? v.data.summary) : v.data.summary;
  const skillGroups = compact ? skills.filter((s) => s.compact !== false) : skills;

  const contact: ContentText['text'] = [
    ...(options.phone ? [options.phone] : []),
    { text: profile.email, link: `mailto:${profile.email}` },
    { text: profile.linkedin, link: profileUrl(profile.linkedin) },
    ...(profile.github ? [{ text: profile.github, link: profileUrl(profile.github) }] : []),
    profile.location,
  ].flatMap((part, i) => (i === 0 ? [part] : [SEP, part]));

  const content: Content[] = [
    { text: profile.name, font: 'Serif', fontSize: 23 },
    { text: profile.headline, font: 'SansSemiBold', fontSize: 11.5, color: ACCENT, margin: [0, 2, 0, 4] },
    { text: contact, fontSize: 9.4, color: MUTED },

    ...section('Summary', [{ text: summary, lineHeight: 1.14 }]),

    ...section('Experience', experience.flatMap((exp, i) => experienceBlocks(exp, i, compact))),

    ...(projects.length ? section('Projects', projects.flatMap((p, i) => projectBlocks(p, i, compact))) : []),

    ...section(
      'Skills',
      skillGroups.map((s) => ({
        text: [{ text: `${s.group}: `, bold: true }, inlineList(s.items)],
        margin: [0, 0, 0, 2.5],
      })),
    ),

    ...(education.length && compact
      ? section('Education', [
          {
            text: education.flatMap((e, i) => [
              ...(i > 0 ? [SEP] : []),
              { text: e.degree, bold: true },
              ` (${[e.gpa && `GPA ${e.gpa}`, e.end].filter(Boolean).join(', ')})`,
            ]).concat([`${SEP}${[...new Set(education.map((e) => e.school))].join(', ')}`]),
          },
        ])
      : []),

    ...(education.length && !compact
      ? section(
          'Education',
          education.map((e) => ({
            stack: [
              dated(
                { text: [{ text: e.degree, bold: true }, ...(e.gpa ? [`, GPA ${e.gpa}`] : []), `${SEP}${e.school}`] },
                `${e.start} – ${e.end}`,
              ),
            ],
            margin: [0, 0, 0, 2.5],
          })),
        )
      : []),

    ...(!compact && (publications.length || certifications.length)
      ? section(referenceTitle(publications.length, certifications.length), [
          ...publications.map((p) => bullet([`“${p.title},” `, { text: p.venue, italics: true }])),
          ...certifications.map((c) => bullet(c)),
        ])
      : []),
  ];

  return {
    pageSize: 'A4',
    pageMargins: [PAGE_MARGIN_X, layout.marginY, PAGE_MARGIN_X, layout.marginY + 2],
    language: 'en',
    info: {
      title: `${profile.name} | Resume`,
      author: profile.name,
      subject: profile.headline,
      keywords: skills.flatMap((s) => s.items).join(', '),
      creator: `Resume v${v.version} (${v.label})`,
    },
    defaultStyle: { font: 'Sans', fontSize: layout.fontSize, lineHeight: layout.lineHeight, color: INK },
    footer: (currentPage, pageCount) => ({
      text: `${profile.name}${SEP}Page ${currentPage} of ${pageCount}`,
      alignment: 'right',
      fontSize: 8,
      color: '#8a887f',
      margin: [PAGE_MARGIN_X, 14, PAGE_MARGIN_X, 0],
    }),
    content,
  };
}

/** Renders the PDF and fails if it runs past its page budget (full: 2, compact: 1). */
export async function renderResumePdf(v: ResumeVersion, options: PdfOptions = {}): Promise<Uint8Array<ArrayBuffer>> {
  const variant = options.variant ?? 'full';
  const doc = buildDocDefinition(v, options);
  const footer = doc.footer as (page: number, count: number) => Content;
  let pageCount = 0;
  doc.footer = (page: number, count: number) => {
    pageCount = count;
    return footer(page, count);
  };

  const buffer = await pdfmake.createPdf(doc).getBuffer();
  if (pageCount === 0) throw new Error(`Resume ${v.id} ${variant} PDF: could not count pages (footer never rendered).`);
  const maxPages = PDF_MAX_PAGES[variant];
  if (pageCount > maxPages) {
    throw new Error(
      `Resume ${v.id} ${variant} PDF is ${pageCount} pages; the limit is ${maxPages}. ` +
        (variant === 'compact' ? 'Trim `compact` picks or `summaryCompact`.' : 'Cut or shorten bullets.'),
    );
  }
  return new Uint8Array(buffer);
}
