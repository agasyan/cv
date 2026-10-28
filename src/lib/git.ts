import { execFileSync } from 'node:child_process';

/** The deploy manifest that `npm run deploy` commits after each deploy (scripts/deploy.js). */
export const DEPLOY_MANIFEST = 'deploy.json';

/**
 * Date (`YYYY-MM-DD`) of the last commit that changed the site, ignoring the deploy manifest's own commits.
 * Returns null outside a git checkout, so the footer falls back to the version's month.
 */
export function lastContentCommitDate(): string | null {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', '.', `:(exclude)${DEPLOY_MANIFEST}`], {
      cwd: __PROJECT_ROOT__,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
  } catch {
    return null;
  }
}
