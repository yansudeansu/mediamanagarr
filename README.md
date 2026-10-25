# MediaManagarr

**Your self-hosted media ecosystem, all in one place.**

MediaManagarr is an open-source, cross-browser companion for monitoring and managing self-hosted media services from a unified interface. It is being built with Vue 3, TypeScript, and Vite, with an emphasis on accessibility, reusable components, privacy, and automated testing.

> [!IMPORTANT]
> **Early development:** MediaManagarr is not yet ready for everyday use. The service integrations below are planned, not implemented. Browser-extension release packages are experimental until cross-browser packaging and compatibility testing are complete.

## Planned integrations

| Service     | Planned functionality                                      |
| ----------- | ---------------------------------------------------------- |
| Jellyfin    | Recently added media, unwatched content, and notifications |
| Seerr       | Media requests and their status                            |
| Sonarr      | Upcoming television episodes                               |
| Radarr      | Upcoming movie releases                                    |
| qBittorrent | Torrent activity, progress, and management                 |

The initial target is a browser extension for Firefox, Zen Browser, Chrome, and compatible Chromium-based browsers. A standalone web application may be explored later.

## Goals

- Bring multiple self-hosted media services into one consistent interface.
- Build accessible, keyboard-friendly components with clear loading and error states.
- Use a reusable design system based on Atomic Design principles.
- Isolate browser-specific behavior from the shared Vue application.
- Keep dependencies intentional and test features as they are developed.
- Keep credentials and personal server configuration out of source control and documentation examples.
- Maintain a stable default branch through pull requests, automated checks, and intentional releases.

## Technology

| Area                     | Tool                        |
| ------------------------ | --------------------------- |
| Framework                | Vue 3                       |
| Language                 | TypeScript                  |
| Build                    | Vite                        |
| Extension manifest       | Manifest V3                 |
| Package manager          | npm                         |
| Testing                  | Vitest and Vue Test Utils   |
| Linting and formatting   | ESLint and Prettier         |
| CI and release workflows | GitHub Actions              |
| Component documentation  | Storybook                   |
| Accessibility tooling    | Storybook a11y and axe-core |
| Commit conventions       | Conventional Commits        |
| Commit validation        | Commitlint and Husky        |
| Versioning               | Semantic Versioning         |

## Getting started

### Requirements

Install a Node.js version supported by the engines declared in `package.json`, along with npm.

```bash
git clone https://github.com/yansudeansu/mediamanagarr.git
cd mediamanagarr
npm ci
npm run start
```

The development server is useful for working on the Vue application. Browser-extension behavior should also be verified using the built extension.

### Development commands

```bash
npm run start
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run test
npm run test:watch
npm run build
npm run storybook
npm run build-storybook
npm run check
```

`npm run check` runs linting, formatting verification, tests, and a production build. It is the recommended command before opening or updating a pull request.

### Build the browser extension

```bash
npm run build
```

The production build is written to `dist/`.

The generated `dist/manifest.json` receives its version from `package.json`. This keeps the application version and extension manifest synchronized without manually editing the manifest template.

The application shell has been loaded and visually verified as an unpacked or temporary extension in Chrome and Zen Browser. This does not yet constitute complete browser compatibility or distribution testing.

## Component library

MediaManagarr uses Storybook to develop, document, and test reusable UI components independently of the application.

**[Explore the component library](https://yansudeansu.github.io/mediamanagarr/)**

### Local development

Start Storybook:

```bash
npm run storybook
```

Build the static component library:

```bash
npm run build-storybook
```

Storybook is automatically built and deployed to GitHub Pages through GitHub Actions when changes are pushed to `master`.

### Pull-request previews

Pull requests also receive Storybook preview builds to help reviewers inspect UI changes before merging.

The preview automation:

- Builds Storybook for pull requests.
- Publishes eligible previews under a PR-specific path.
- Provides the preview link through pull-request automation.
- Updates the preview when the pull request changes.
- Keeps the production Storybook deployment separate.
- Cleans up preview content when the pull request closes.

Preview publishing uses separate unprivileged build and privileged publishing stages. Preview content must use mock data only and must never contain credentials or private server information.

For example, a preview for pull request #4 uses a path such as:

```text
https://yansudeansu.github.io/mediamanagarr/pr-preview/pr-4/
```

Preview availability may depend on repository permissions and the pull request's origin.

### Component conventions

Components follow Atomic Design principles and are organized by responsibility:

- **Atoms:** Basic UI elements such as buttons, badges, and inputs.
- **Molecules:** Combinations of atoms, such as form fields and filters.
- **Organisms:** Larger interface sections, such as media cards and service panels.
- **Templates:** Reusable page and application layouts.

Each reusable component keeps its implementation, Storybook stories, and component tests together.

For example:

```text
src/components/atoms/MmButton/
├── MmButton.vue
├── MmButton.stories.ts
└── MmButton.test.ts
```

Stories should demonstrate relevant variants, interaction states, and accessibility considerations. Component tests should cover meaningful behavior rather than implementation details.

### Accessibility

Storybook includes accessibility tooling powered by axe-core to identify potential issues such as missing accessible names, insufficient color contrast, and invalid ARIA attributes.

Automated checks are supplemented by manual keyboard and visual testing, with WCAG 2.2 AA as the accessibility target.

## Development workflow

The default branch is `master`. Development changes should be made on short-lived branches and submitted through pull requests.

### Conventional Commits

Commit messages and pull-request titles follow Conventional Commits.

Examples:

```text
feat: add service connection form
fix: correct popup scrolling
docs: update development roadmap
refactor: simplify navigation state
test: cover connection failures
chore: update extension icons
ci: improve GitHub Actions workflow
```

Breaking changes use `!` in the commit header or a `BREAKING CHANGE:` footer.

Commitlint validates commit messages, and Husky runs local Git hooks. A pre-push hook runs the shared project checks.

Local hooks provide early feedback but do not replace GitHub Actions or repository branch-protection rules.

### Pull-request automation

Pull requests receive automated feedback to support consistent reviews.

The automation includes:

- Conventional Commit validation for pull-request titles and commits.
- Release-impact analysis based on Conventional Commits.
- A generated pull-request overview with relevant change information.
- A Storybook preview link when a hosted preview is available.
- GitHub Actions checks for code quality and build correctness.

Release-impact reporting distinguishes between the impact of an individual pull request and the impact of all unreleased changes.

A feature normally implies a minor version bump, a fix or performance improvement implies a patch bump, and a breaking change implies a major bump. Documentation-only and maintenance changes do not normally require a release.

The report is informational. Pull-request automation does not change application versions or publish releases.

### Merge conventions

The project uses Conventional Commits to support release analysis.

For squash merges, the resulting squash commit message should use a valid Conventional Commit header. For merge and rebase strategies, preserved commits should follow the same convention.

The release preparation script analyzes non-merge commits when determining release impact.

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional contribution guidance.

## Versioning and releases

MediaManagarr uses Semantic Versioning and a manually initiated release preparation process.

**Ordinary pull-request merges do not publish releases.**

### Release preparation

An authorized maintainer starts the **Prepare Release** GitHub Actions workflow on `master`.

The workflow:

1. Analyzes unreleased Conventional Commits.
2. Calculates the next version.
3. Updates `package.json` and `package-lock.json`.
4. Creates or updates `CHANGELOG.md`.
5. Runs the project checks.
6. Opens or updates a release pull request.

The first release preparation creates `CHANGELOG.md` automatically if it does not already exist.

Release preparation is protected against repeated execution on an already modified working tree. The release pull request provides a review step before the version update reaches `master`.

### Release publishing

After the release pull request passes the required checks and is approved, merging it into `master` triggers the **Publish Release** workflow.

The publishing workflow is designed to:

- Verify the release commit, version, lockfile, and changelog.
- Run project checks and build the extension.
- Validate the generated manifest version.
- Create the Git tag and GitHub Release.
- Attach Chrome and Firefox ZIP archives.
- Recover from certain interrupted publishing attempts without duplicating existing assets.

Publishing can also be manually rerun for recovery.

> [!WARNING]
> GitHub Release publishing and recovery have been implemented but have not yet been verified through a complete real release. Browser-specific ZIP archives are currently produced from the same build and require further compatibility testing before being considered distributable releases.

Release preparation and publishing require appropriate GitHub Actions permissions and repository configuration. The release preparation workflow uses a repository secret named `RELEASE_TOKEN` to create the release pull request.

## Roadmap

Development is organized into incremental milestones, starting with repository tooling, Storybook, the design system, and application shell, followed by workflow automation, service configuration, integrations, browser testing, and distribution.

**Milestones 0, 1, and 2 are complete. Milestone 2.5 is in progress.**

Milestone 2.5 covers Conventional Commits, Git safeguards, pull-request reporting, Storybook previews, changelog generation, and release automation.

Read the [full roadmap](docs/ROADMAP.md) for planned milestones, architecture, accessibility, testing strategy, and remaining verification work.

## Architecture

Reusable components follow Atomic Design, while complete screens live in `src/views/`. Service API logic and browser-specific adapters remain separate from presentation components. Directories are added as they become necessary.

The extension uses a custom Vite-based Manifest V3 setup rather than an additional extension framework.

## Background

MediaManagarr is inspired by the existing **Media Monitor** browser extension, which serves as a functional reference. MediaManagarr is a separate implementation, not a direct migration of its codebase.

## Contributing

Suggestions, bug reports, and contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and pull-request guidance.

## Security and privacy

Do not post real API keys, passwords, private server addresses, or personal media data in issues, tests, screenshots, or Storybook stories.

Pull-request preview builds must contain mock data only. The final credential storage and extension permissions model has not yet been implemented.

See the [roadmap's security section](docs/ROADMAP.md#security-and-privacy) for additional design goals.

## License

Licensed under the [MIT License](LICENSE).
