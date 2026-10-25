import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'

const {
  BASE_SHA,
  HEAD_SHA,
  PR_TITLE,
  PR_NUMBER,
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  GITHUB_STEP_SUMMARY,
} = process.env

if (!BASE_SHA || !HEAD_SHA || !PR_TITLE || !PR_NUMBER || !GITHUB_TOKEN || !GITHUB_REPOSITORY) {
  throw new Error('Missing required GitHub Actions environment variables.')
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`)
  }

  return response.json()
}

async function githubAll(path) {
  const results = []

  for (let page = 1; ; page += 1) {
    const separator = path.includes('?') ? '&' : '?'
    const items = await github(`${path}${separator}per_page=100&page=${page}`)

    results.push(...items)

    if (items.length < 100) {
      return results
    }
  }
}

function validateCommit(message) {
  execFileSync('npx', ['--no', '--', 'commitlint'], {
    input: message,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
}

function analyzeCommit(message) {
  const header = message.split('\n')[0]
  const match = header.match(/^(\w+)(?:\([^)]+\))?(!)?:/)

  if (!match) {
    throw new Error(`Cannot analyze commit: ${header}`)
  }

  const [, type, breakingMarker] = match

  let impact = 'none'

  if (breakingMarker || /^BREAKING[ -]CHANGE:/m.test(message)) {
    impact = 'major'
  } else if (type === 'feat') {
    impact = 'minor'
  } else if (type === 'fix' || type === 'perf') {
    impact = 'patch'
  }

  return { header, type, impact }
}

const rank = { none: 0, patch: 1, minor: 2, major: 3 }

// Validate the PR title.
validateCommit(PR_TITLE)

// Find the commits actually introduced by this PR.
const mergeBase = execFileSync('git', ['merge-base', BASE_SHA, HEAD_SHA], {
  encoding: 'utf8',
}).trim()

const gitCommits = execFileSync(
  'git',
  ['log', '--reverse', '--format=%B%x00', `${mergeBase}..${HEAD_SHA}`],
  { encoding: 'utf8' },
)
  .split('\0')
  .map((message) => message.trim())
  .filter(Boolean)

if (gitCommits.length === 0) {
  throw new Error('No commits found for this pull request.')
}

const types = {}
let impact = 'none'
let breakingChanges = 0

for (const message of gitCommits) {
  validateCommit(message)

  const result = analyzeCommit(message)

  types[result.type] = (types[result.type] ?? 0) + 1

  if (result.impact === 'major') {
    breakingChanges += 1
  }

  if (rank[result.impact] > rank[impact]) {
    impact = result.impact
  }
}

// Fetch PR metadata for the overview.
const pr = await github(`/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}`)

const commits = await githubAll(`/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}/commits`)

// Use the GitHub API commit list for display purposes.
const commitLines = commits.map((commit) => {
  const subject = commit.commit.message.split('\n')[0]
  return `- \`${commit.sha.slice(0, 7)}\` ${subject}`
})

const typeLines = Object.entries(types)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([type, count]) => `- \`${type}\`: ${count}`)

const report = [
  '<!-- mediamanagarr-pr-overview -->',
  '## MediaManagarr — Pull Request Overview',
  '',
  `**PR #${pr.number}:** ${pr.title}`,
  '',
  '### Changes',
  '',
  '| Metric | Result |',
  '| --- | --- |',
  `| Commits | ${gitCommits.length} |`,
  `| Files changed | ${pr.changed_files} |`,
  `| Additions / deletions | +${pr.additions} / −${pr.deletions} |`,
  `| Breaking changes | ${breakingChanges} |`,
  `| Release impact | **${impact.toUpperCase()}** |`,
  '',
  '### Commit types',
  '',
  ...typeLines,
  '',
  '### Commits',
  '',
  ...commitLines,
  '',
  '### Validation',
  '',
  '✅ PR title and Conventional Commit messages passed.',
  '',
  '### Storybook preview',
  '',
  '⏳ Preview deployment not configured yet.',
  '',
  '_Release impact is informational; no version changes are made._',
  '',
].join('\n')

writeFileSync('pr-overview.md', report)

if (GITHUB_STEP_SUMMARY) {
  appendFileSync(GITHUB_STEP_SUMMARY, report)
}

console.log(report)
