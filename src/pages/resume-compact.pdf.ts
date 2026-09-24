// The published version's 1-page PDF (see src/config.ts): /resume-compact.pdf
import type { APIRoute } from 'astro';
import { getPublished } from '../lib/resume';
import { renderResumePdf } from '../pdf/build';

export const GET: APIRoute = async () =>
  new Response(await renderResumePdf(await getPublished(), { variant: 'compact' }), {
    headers: { 'Content-Type': 'application/pdf' },
  });
