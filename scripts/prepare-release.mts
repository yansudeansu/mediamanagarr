import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { conventionalChangelog } from 'conventional-changelog'
import { pipeline } from 'node:stream/promises'
import { Writable } from 'node:stream'

type ReleaseType = 'major' | 'minor' | 'patch'

interface PackageJson {
  version: string
}

interface Commit {
  subject: string
  body: string
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

  if (!tags) {
    return null
  }

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
  const output = git('log', range, '--format=%s%x1f%b%x1e')

  return output
    .split('\x1e')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [subject = '', body = ''] = entry.split('\x1f')

      return { subject, body }
    })
}

function releaseImpact(commits: Commit[]): ReleaseType | null {
  let impact: ReleaseType | null = null

  for (const { subject, body } of commits) {
    if (/^[a-z]+(?:\([^)]+\))?!:/.test(subject) || /^BREAKING(?: CHANGE|-CHANGE):/m.test(body)) {
      return 'major'
    }

    if (/^feat(?:\([^)]+\))?:/.test(subject)) {
      impact = 'minor'
    } else if (/^fix(?:\([^)]+\))?:/.test(subject) && impact === null) {
      impact = 'patch'
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

async function generateChangelog(version: string, previousTag: string | null): Promise<void> {
  const chunks: Buffer[] = []

  const destination = new Writable({
    write(chunk: Buffer, _encoding, callback) {
      chunks.push(Buffer.from(chunk))
      callback()
    },
  })

  const stream = conventionalChangelog(
    {
      releaseCount: 1,
      outputUnreleased: false,
    },
    {
      preset: {
        name: 'conventionalcommits',
      },
    },
  )

  await pipeline(stream, destination)

  const generated = Buffer.concat(chunks).toString('utf8').trim()

  if (!generated) {
    throw new Error('Changelog generation returned no content.')
  }

  const existing = existsSync('CHANGELOG.md') ? readFileSync('CHANGELOG.md', 'utf8') : ''

  const header = '# Changelog\n\n'

  const previous = existing.startsWith(header) ? existing.slice(header.length) : existing

  writeFileSync('CHANGELOG.md', `${header}${generated}\n\n${previous.trimStart()}`)

  console.log(`Generated changelog for v${version} since ${previousTag ?? 'project start'}.`)
}

async function main(): Promise<void> {
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

  console.log(`Preparing v${version}`)

  run('npm', 'version', version, '--no-git-tag-version')

  await generateChangelog(version, previousTag)

  writeFileSync('release-version.txt', `${version}\n`)

  console.log(`Prepared release v${version}`)
}

await main()
