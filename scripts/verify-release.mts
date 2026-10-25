import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'

interface PackageJson {
  version: string
}

interface PackageLock {
  version: string
  packages?: Record<string, { version?: string }>
}

function git(...args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
  }).trim()
}

function compareVersions(left: string, right: string): number {
  const a = left.split('.').map(Number)
  const b = right.split('.').map(Number)

  for (let index = 0; index < 3; index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0)

    if (difference !== 0) {
      return difference
    }
  }

  return 0
}

function output(name: string, value: string): void {
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`)
  }
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson

const version = packageJson.version
const tag = `v${version}`

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`)
}

const subject = git('log', '-1', '--format=%s')
const expected = `chore(release): ${tag}`

if (subject !== expected) {
  console.log('Current commit is not a release commit.')
  output('publish', 'false')
  process.exit(0)
}

const previousVersion = JSON.parse(git('show', 'HEAD^:package.json')) as PackageJson

if (!/^\d+\.\d+\.\d+$/.test(previousVersion.version)) {
  throw new Error(`Invalid previous version: ${previousVersion.version}`)
}

if (compareVersions(version, previousVersion.version) <= 0) {
  throw new Error(`Release version must increase: ${previousVersion.version} → ${version}`)
}

const lockfile = JSON.parse(readFileSync('package-lock.json', 'utf8')) as PackageLock

if (lockfile.version !== version || lockfile.packages?.['']?.version !== version) {
  throw new Error('package-lock.json version does not match package.json.')
}

const changelog = readFileSync('CHANGELOG.md', 'utf8')

const escapedVersion = version.replaceAll('.', '\\.')

if (!new RegExp(`^## v${escapedVersion}\\s*$`, 'm').test(changelog)) {
  throw new Error(`CHANGELOG.md is missing the v${version} section.`)
}

const existingTags = git('tag', '--list', tag)

if (existingTags.split('\n').includes(tag)) {
  console.log(`Release tag ${tag} already exists. Skipping publication.`)
  output('publish', 'false')
  process.exit(0)
}

console.log(`Verified release ${tag}`)

output('publish', 'true')
output('version', version)
