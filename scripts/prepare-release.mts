import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

type ReleaseType = 'major' | 'minor' | 'patch'

interface PackageJson {
  version: string
}

interface Commit {
  sha: string
  subject: string
  body: string
  type: string
  description: string
  breaking: boolean
}

const releaseRank: Record<ReleaseType, number> = {
  patch: 1,
  minor: 2,
  major: 3,
}

function git(...args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
  }).trim()
}

function run(command: string, ...args: string[]): void {
  execFileSync(command, args, {
    stdio: 'inherit',
  })
}

function latestTag(): string | null {
  const tags = git('tag', '--list', 'v[0-9]*')

  const versions = tags
    .split('\n')
    .filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag))
    .sort((a, b) => {
      const left = a.slice(1).split('.').map(Number)
      const right = b.slice(1).split('.').map(Number)

      for (let index = 0; index < 3; index += 1) {
        const difference = (right[index] ?? 0) - (left[index] ?? 0)

        if (difference !== 0) {
          return difference
        }
      }

      return 0
    })

  return versions[0] ?? null
}

function getCommits(tag: string | null): Commit[] {
  const range = tag ? `${tag}..HEAD` : 'HEAD'

  const hashes = git('rev-list', '--reverse', '--no-merges', range).split('\n').filter(Boolean)

  return hashes.flatMap((sha) => {
    const message = git('show', '-s', '--format=%B', sha)
    const [subject = '', ...bodyLines] = message.split('\n')
    const body = bodyLines.join('\n').trim()

    const match = subject.match(/^([a-z]+)(?:\([^)]+\))?(!)?:\s+(.+)$/)

    if (!match) {
      return []
    }

    const [, type, breakingMarker, description] = match

    return [
      {
        sha,
        subject,
        body,
        type,
        description,
        breaking: Boolean(breakingMarker) || /^BREAKING[ -]CHANGE:/m.test(body),
      },
    ]
  })
}

function releaseImpact(commits: Commit[]): ReleaseType | null {
  let impact: ReleaseType | null = null

  for (const commit of commits) {
    let next: ReleaseType | null = null

    if (commit.breaking) {
      next = 'major'
    } else if (commit.type === 'feat') {
      next = 'minor'
    } else if (commit.type === 'fix' || commit.type === 'perf') {
      next = 'patch'
    }

    if (next && (!impact || releaseRank[next] > releaseRank[impact])) {
      impact = next
    }
  }

  return impact
}

function bumpVersion(version: string, impact: ReleaseType): string {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)

  if (!match) {
    throw new Error(`Invalid version: ${version}`)
  }

  const major = Number(match[1])
  const minor = Number(match[2])
  const patch = Number(match[3])

  switch (impact) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
  }
}

function changelogSection(version: string, commits: Commit[]): string {
  const groups: Array<[string, string[]]> = [
    ['Breaking Changes', []],
    ['Features', []],
    ['Bug Fixes', []],
    ['Performance Improvements', []],
  ]

  for (const commit of commits) {
    const line = `- ${commit.description} (${commit.sha.slice(0, 7)})`

    if (commit.breaking) {
      groups[0]![1].push(line)
    } else if (commit.type === 'feat') {
      groups[1]![1].push(line)
    } else if (commit.type === 'fix') {
      groups[2]![1].push(line)
    } else if (commit.type === 'perf') {
      groups[3]![1].push(line)
    }
  }

  const sections = groups
    .filter(([, lines]) => lines.length > 0)
    .map(([heading, lines]) => `### ${heading}\n\n${lines.join('\n')}`)

  return [`## v${version}`, '', ...sections].join('\n\n')
}

function updateChangelog(version: string, commits: Commit[]): void {
  const existing = existsSync('CHANGELOG.md') ? readFileSync('CHANGELOG.md', 'utf8') : ''

  if (new RegExp(`^## v${version.replaceAll('.', '\\.')}\\s*$`, 'm').test(existing)) {
    throw new Error(`CHANGELOG.md already contains v${version}.`)
  }

  const header = '# Changelog'
  const previous = existing.startsWith(header)
    ? existing.slice(header.length).trim()
    : existing.trim()

  const section = changelogSection(version, commits)

  const updated = [header, '', section, ...(previous ? ['', previous] : []), ''].join('\n')

  writeFileSync('CHANGELOG.md', updated)
}

function main(): void {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson

  const previousTag = latestTag()
  const commits = getCommits(previousTag)
  const impact = releaseImpact(commits)

  if (!impact && previousTag) {
    console.log('No releasable commits found.')
    return
  }

  const version =
    !previousTag && packageJson.version === '0.0.0'
      ? '0.1.0'
      : impact
        ? bumpVersion(packageJson.version, impact)
        : null

  if (!version) {
    console.log('No releasable commits found.')
    return
  }

  if (git('tag', '--list', `v${version}`) === `v${version}`) {
    throw new Error(`Release tag v${version} already exists.`)
  }

  console.log(`Preparing v${version}`)

  // Generate the changelog before changing package files.
  updateChangelog(version, commits)

  run('npm', 'version', version, '--no-git-tag-version', '--ignore-scripts')

  writeFileSync('release-version.txt', `${version}\n`)

  console.log(`Prepared release v${version}`)
}

main()
