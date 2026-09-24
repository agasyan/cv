// Local-only PDFs (`npm run dev`), never built for production:
//   /resume/2026-09.pdf                     full, no phone
//   /resume/2026-09-compact.pdf             1 page, no phone
//   /resume/2026-09-with-phone.pdf          full, with RESUME_PHONE from .env
//   /resume/2026-09-compact-with-phone.pdf  1 page, with RESUME_PHONE from .env
import type { APIRoute, GetStaticPaths } from 'astro';
import { getVersions, type PdfVariant, type ResumeVersion } from '../../lib/resume';
import { renderResumePdf } from '../../pdf/build';

export const getStaticPaths = (async () => {
  if (!import.meta.env.DEV) return [];
  const versions = await getVersions();
  return versions.flatMap((v) =>
    (['full', 'compact'] as const).flatMap((variant) =>
      [false, true].map((withPhone) => ({
        params: { file: `${v.id}${variant === 'compact' ? '-compact' : ''}${withPhone ? '-with-phone' : ''}` },
        props: { v, variant, withPhone },
      })),
    ),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ v: ResumeVersion; variant: PdfVariant; withPhone: boolean }> = async ({ props }) => {
  // Guarded by DEV so a production build never inlines the phone value.
  const phone = import.meta.env.DEV && props.withPhone ? import.meta.env.RESUME_PHONE?.trim() : undefined;
  if (props.withPhone && !phone) {
    return new Response('Set RESUME_PHONE in .env (see .env.example), then restart `npm run dev`.', { status: 400 });
  }
  const pdf = await renderResumePdf(props.v, { variant: props.variant, phone });
  return new Response(pdf, { headers: { 'Content-Type': 'application/pdf' } });
};
