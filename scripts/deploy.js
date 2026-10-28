// `npm run deploy`: build, upload dist/ to Cloudflare Pages, then commit the deploy manifest (deploy.json).
// Runs only on main, from a clean tree that is not behind origin/main, so every deploy is exactly one commit.
// Skips when nothing changed since the last deploy; `npm run deploy -- --force` deploys anyway.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const MANIFEST = 'deploy.json';
const force = process.argv.includes('--force');

function fail(message) {
  console.error(`deploy: ${message}`);
  process.exit(1);
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

/** Runs a command with its output in the terminal; stops the deploy if it fails. */
function run(label, command, args) {
  try {
    execFileSync(command, args, { stdio: 'inherit' });
  } catch {
    fail(`${label} failed; nothing was committed.`);
  }
}

let branch = '';
try {
  branch = git('rev-parse', '--abbrev-ref', 'HEAD');
} catch {
  fail('run it from the repo root, inside the git checkout.');
}
if (branch !== 'main') fail(`runs only on main (you are on ${branch}). Merge first, then deploy from main.`);
if (git('status', '--porcelain')) fail('the working tree has changes. Commit or stash them: a deploy is always one commit.');

try {
  git('fetch', '--quiet', 'origin', 'main');
} catch {
  fail('could not fetch origin/main. Check your connection and try again.');
}
const behind = Number(git('rev-list', '--count', 'HEAD..origin/main'));
if (behind > 0) fail(`main is ${behind} commit(s) behind origin/main. Run git pull first.`);

const project = readFileSync('wrangler.toml', 'utf8').match(/^name\s*=\s*"([^"]+)"/m)?.[1];
if (!project) fail('wrangler.toml has no project name.');

const commit = git('rev-parse', 'HEAD');
let last = null;
try {
  last = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : null;
} catch {
  console.warn(`deploy: ${MANIFEST} is not valid JSON; deploying and rewriting it.`);
}
if (last?.commit && !force) {
  let changed = 'unknown';
  try {
    changed = git('diff', '--name-only', last.commit, commit, '--', '.', `:(exclude)${MANIFEST}`);
  } catch {
    // The last deployed commit is not in this history (e.g. rewritten): deploy.
  }
  if (!changed) {
    console.log(`deploy: nothing changed since ${last.commit.slice(0, 7)} went live. Use --force to deploy anyway.`);
    process.exit(0);
  }
}

run('The build', 'npm', ['run', 'build']);
run('The upload to Cloudflare Pages', 'npx', [
  '--yes',
  'wrangler@4',
  'pages',
  'deploy',
  'dist',
  '--project-name',
  project,
  '--branch',
  'main',
  '--commit-hash',
  commit,
  '--commit-message',
  git('log', '-1', '--format=%s'),
  '--commit-dirty=false',
]);

const manifest = {
  project,
  url: process.env.SITE_URL ?? `https://${project}.pages.dev`,
  branch: 'main',
  commit,
  deployedAt: new Date().toISOString(),
};
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
try {
  git('add', MANIFEST);
  git('commit', '--quiet', '-m', `Deploy ${commit.slice(0, 7)} to ${new URL(manifest.url).host}`, '--', MANIFEST);
} catch {
  fail(`the site is live, but committing ${MANIFEST} failed. Commit it by hand.`);
}
console.log(`deploy: live at ${manifest.url}. Committed ${MANIFEST} on main; push main to share it.`);
