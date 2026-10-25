import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

interface PackageJson {
  version: string
}

function git(...args: string[]): string {
  return execFileSync('git', args, {
    encoding: 'utf8',
  }).trim()
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson

const version = packageJson.version
const tag = `v${version}`

if (!/^\d+\.\d+\.\d+$/.test(version)) {
  throw new Error(`Invalid release version: ${version}`)
}

const message = git('log', '-1', '--format=%s')
const expected = `chore(release): ${tag}`

if (message !== expected) {
  console.log('Current commit is not a release commit.')
  process.exit(0)
}

const previousVersion = JSON.parse(git('show', 'HEAD^:package.json')) as PackageJson

if (previousVersion.version === version) {
  throw new Error('Release commit did not change the package version.')
}

const existingTags = git('tag', '--list', tag)

if (existingTags.split('\n').includes(tag)) {
  throw new Error(`Release tag ${tag} already exists.`)
}

console.log(`Verified release ${tag}`)
