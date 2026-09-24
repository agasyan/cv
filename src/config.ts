/**
 * Which resume version the site publishes. The owner decides this here; visitors never switch versions.
 *
 * - 'latest': the file in src/data/resumes with the highest `version`.
 * - A file id such as '2026-09': pin that version (e.g. to roll back).
 *
 * Every other version stays in the repo and can be previewed locally with `npm run dev` at /v/<id>/.
 */
export const PUBLISHED_VERSION: 'latest' | string = 'latest';
