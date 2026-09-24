/** Absolute project root, injected by astro.config.mjs (vite.define). */
declare const __PROJECT_ROOT__: string;

interface ImportMetaEnv {
  /** Local only (.env). Printed in the dev "PDF with phone" download, never on the site. */
  readonly RESUME_PHONE?: string;
}
