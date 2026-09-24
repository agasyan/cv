// The published version's PDF (see src/config.ts): /resume.pdf
import type { APIRoute } from 'astro';
import { getPublished } from '../lib/resume';
import { renderResumePdf } from '../pdf/build';

export const GET: APIRoute = async () =>
  new Response(await renderResumePdf(await getPublished()), { headers: { 'Content-Type': 'application/pdf' } });
