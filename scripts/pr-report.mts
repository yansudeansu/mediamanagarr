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

type ReleaseImpact = 'none' | 'patch' | 'minor' | 'major'

type CommitAnalysis = {
  header: string
  type: string
  impact: ReleaseImpact
}

type GitCommit = {
  sha: string
  message: string
}

type PullRequest = {
  number: number
  title: string
  changed_files: number
  additions: number
  deletions: number
}

type PullRequestCommit = {
  sha: string
  commit: {
    message: string
  }
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

async function github<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

async function githubAll<T>(path: string): Promise<T[]> {
  const results: T[] = []

  for (let page = 1; ; page += 1) {
    const separator = path.includes('?') ? '&' : '?'
    const items = await github<T[]>(`${path}${separator}per_page=100&page=${page}`)

    results.push(...items)

    if (items.length < 100) {
      return results
    }
  }
}

function git(args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
  }).trim()
}

function validateCommit(message: string): void {
  execFileSync('npx', ['--no', '--', 'commitlint'], {
    input: message,
    stdio: ['pipe', 'inherit', 'inherit'],
  })
}

function analyzeCommit(message: string): CommitAnalysis {
  const header = message.split('\n')[0]
  const match = header.match(/^(\w+)(?:\([^)]+\))?(!)?:/)

  if (!match) {
    throw new Error(`Cannot analyze commit: ${header}`)
  }

  const [, type, breakingMarker] = match

  let impact: ReleaseImpact = 'none'

  if (breakingMarker || /^BREAKING[ -]CHANGE:/m.test(message)) {
    impact = 'major'
  } else if (type === 'feat') {
    impact = 'minor'
  } else if (type === 'fix' || type === 'perf') {
    impact = 'patch'
  }

  return { header, type, impact }
}

const rank: Record<ReleaseImpact, number> = {
  none: 0,
  patch: 1,
  minor: 2,
  major: 3,
}

// Validate the PR title, which becomes the squash commit message.
validateCommit(PR_TITLE)

// Verify that both commits exist locally.
git(['rev-parse', '--verify', `${BASE_SHA}^{commit}`])
git(['rev-parse', '--verify', `${HEAD_SHA}^{commit}`])

// Select commits reachable from the PR head but not from the PR base.
//
// --no-merges excludes merge commits based on their parent count.
// This is more reliable than checking whether a subject starts with "Merge".
//
// Using BASE_SHA..HEAD_SHA instead of mergeBase..HEAD_SHA also avoids
// counting commits brought into the PR branch from the base branch.
const commitHashes = git(['rev-list', '--reverse', '--no-merges', `${BASE_SHA}..${HEAD_SHA}`])
  .split('\n')
  .map((sha) => sha.trim())
  .filter(Boolean)

const gitCommits: GitCommit[] = commitHashes.map((sha) => ({
  sha,
  message: git(['show', '-s', '--format=%B', sha]),
}))

// A PR can contain only merge commits. The PR title still needs to pass
// Conventional Commit validation, but there is nothing else to analyze.
const types: Record<string, number> = {}
let impact: ReleaseImpact = 'none'
let breakingChanges = 0

for (const commit of gitCommits) {
  validateCommit(commit.message)

  const result = analyzeCommit(commit.message)

  types[result.type] = (types[result.type] ?? 0) + 1

  if (result.impact === 'major') {
    breakingChanges += 1
  }

  if (rank[result.impact] > rank[impact]) {
    impact = result.impact
  }
}

// Fetch PR metadata for the overview.
const pr = await github<PullRequest>(`/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}`)

const commits = await githubAll<PullRequestCommit>(
  `/repos/${GITHUB_REPOSITORY}/pulls/${PR_NUMBER}/commits`,
)

// GitHub's PR commit list is used for display. It includes merge commits,
// which are intentionally excluded from Conventional Commit validation.
const commitLines = commits.map((commit) => {
  const subject = commit.commit.message.split('\n')[0]
  return `- \`${commit.sha.slice(0, 7)}\` ${subject}`
})

const typeLines = Object.entries(types)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([type, count]) => `- \`${type}\`: ${count}`)

const previewUrl = `https://yansudeansu.github.io/mediamanagarr/pr-preview/pr-${pr.number}/`

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
  `| Commits | ${commits.length} |`,
  `| Files changed | ${pr.changed_files} |`,
  `| Additions / deletions | +${pr.additions} / −${pr.deletions} |`,
  `| Breaking changes | ${breakingChanges} |`,
  `| Release impact | **${impact.toUpperCase()}** |`,
  '',
  '### Commit types',
  '',
  ...(typeLines.length > 0 ? typeLines : ['_No non-merge commits to analyze._']),
  '',
  '### Commits',
  '',
  ...commitLines,
  '',
  '### Validation',
  '',
  'PR title and non-merge Conventional Commit messages passed.',
  '',
  '### Storybook preview',
  '',
  `Preview URL: ${previewUrl}`,
  '',
  'Status: Pending deployment.',
  '',
  '_Release impact is informational; no version changes are made._',
  '',
].join('\n')

writeFileSync('pr-overview.md', report)

if (GITHUB_STEP_SUMMARY) {
  appendFileSync(GITHUB_STEP_SUMMARY, report)
}

console.log(report)
