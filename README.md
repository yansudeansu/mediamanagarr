# MediaManagarr

**Your self-hosted media ecosystem, all in one place.**

MediaManagarr is an open-source browser extension for monitoring and managing self-hosted media services from a unified interface.

Built with Vue 3, TypeScript, and Vite, the project emphasizes accessibility, reusable components, privacy, and automated testing.

MediaManagarr now implements the core functionality of its predecessor, Media Monitor. Development continues with a focus on reliability, accessibility, usability, and browser compatibility.

> [!IMPORTANT]
> **Early development:** MediaManagarr's core service integrations are implemented, but the extension is not yet considered production-ready. Browser compatibility testing is ongoing, and release ZIP archives are intended for development and testing. MediaManagarr is not yet distributed through browser extension stores.

## Implemented integrations

| Service     | Functionality                                              |
| ----------- | ---------------------------------------------------------- |
| Jellyfin    | Recently added media, unwatched content, and notifications |
| Seerr       | Media requests and their status                            |
| Sonarr      | Upcoming television episodes                               |
| Radarr      | Upcoming movie releases                                    |
| qBittorrent | Torrent activity, progress, and management                 |

### Current functionality

MediaManagarr provides:

- A unified interface for configured self-hosted services.
- Media requests with status filtering and pagination.
- Recently added and unwatched Jellyfin content.
- Jellyfin notification management.
- A calendar of upcoming television episodes and movie releases.
- Torrent monitoring with progress, transfer speeds, ETA, and status.
- Torrent start, stop, and removal actions.
- Confirmation before removing torrents.
- Explicit opt-in before deleting downloaded files.
- Service configuration and Jellyfin user selection.
- Loading, empty, and error states across the main views.

These features are implemented but remain subject to ongoing testing and refinement.

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
npm run build:chrome
npm run build:firefox
npm run storybook
npm run build-storybook
npm run check
```

`npm run check` runs linting, formatting verification, tests, and production builds for Chrome and Firefox. It is the recommended command before opening or updating a pull request.

### Build the browser extension

Build both browser targets:

```bash
npm run build
```

Build a specific browser target:

```bash
npm run build:chrome
npm run build:firefox
```

The production builds are written to separate directories:

```text
dist/
├── chrome/
│   ├── manifest.json
│   ├── background.js
│   └── ...
└── firefox/
    ├── manifest.json
    ├── background.js
    └── ...
```

Each build contains a browser-specific manifest:

- Chrome uses a Manifest V3 background service worker.
- Firefox uses a background script configuration.
- Firefox-specific manifest settings are excluded from the Chrome build.

Both generated manifests receive their version from `package.json`. This keeps the application version and browser extension versions synchronized without manually editing the manifest template.

The application shell and service integrations have been developed and tested incrementally. However, complete compatibility testing across Firefox, Zen Browser, Chrome, and other Chromium-based browsers is still pending.

### Development release archives

MediaManagarr uses GitHub Releases to provide versioned browser-specific extension archives.

The release process generates two separate ZIP files:

```text
mediamanagarr-vX.Y.Z-chrome.zip
mediamanagarr-vX.Y.Z-firefox.zip
```

Each archive contains the corresponding browser build, with `manifest.json` at the root of the ZIP.

The Chrome archive contains the Chromium-targeted extension, while the Firefox archive contains the Firefox-targeted extension.

These archives are intended for development, testing, and release-process verification. They are **not official browser-store distributions**.

> [!IMPORTANT]
> Browser-specific builds do not guarantee complete browser compatibility. MediaManagarr has not yet completed cross-browser verification and is not currently distributed through browser extension stores.

Installation and compatibility should be verified manually before relying on a release package.

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

A comprehensive accessibility audit remains planned.

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
- Build both browser targets from the release commit.
- Validate the Chrome and Firefox manifest versions.
- Verify browser-specific background configurations.
- Package separate Chrome and Firefox ZIP archives.
- Create the Git tag and GitHub Release.
- Upload both browser archives.
- Recover from certain interrupted publishing attempts without duplicating existing assets.

Publishing can also be manually rerun for recovery.

Full linting, formatting, and unit tests run during release preparation and pull-request CI. Release publishing builds the browser extensions and validates the generated artifacts without repeating those checks.

> [!WARNING]
> Chrome and Firefox archives are built separately with browser-specific manifests. Both still require further compatibility testing before being considered ready for general distribution.
>
> Publishing a GitHub Release does not mean MediaManagarr is ready for browser-store distribution.

Release preparation and publishing require appropriate GitHub Actions permissions and repository configuration. The release preparation workflow uses a repository secret named `RELEASE_TOKEN` to create the release pull request.

### Release scope

The current release process focuses on:

- Generating a versioned GitHub Release.
- Updating the package and extension manifest versions.
- Generating a changelog.
- Building and attaching separate browser extension ZIP archives.
- Verifying that release automation works end to end.

**Firefox Add-ons and Chrome Web Store publication are not part of this development release.**

Browser-store submissions remain planned for a later milestone.

## Roadmap

MediaManagarr's foundational development and core service integrations are complete.

The extension now provides the main functionality of the original Media Monitor extension, including Jellyfin arrivals, Seerr requests, Sonarr and Radarr calendars, and qBittorrent download management.

The next development priorities are:

1. **Service Health & Reliability** — Improve connection monitoring, retries, and error handling.
2. **Testing & Accessibility** — Expand browser automation, cross-browser testing, and accessibility verification.
3. **Feature Enhancements** — Refine existing features based on real-world usage.
4. **Branding & Documentation** — Prepare guides, artwork, and release materials.
5. **Release & Distribution** — Complete browser compatibility testing and prepare browser-store submissions.

Testing and accessibility remain ongoing requirements throughout every milestone.

Read the [full roadmap](docs/ROADMAP.md) for planned milestones and remaining verification work.

## Architecture

Reusable components follow Atomic Design, while complete screens live in `src/views/`. Service API logic and browser-specific adapters remain separate from presentation components. Directories are added as they become necessary.

The extension uses a custom Vite-based Manifest V3 setup rather than an additional extension framework.

## Background

MediaManagarr is inspired by the existing **Media Monitor** browser extension, which serves as a functional reference.

MediaManagarr is a separate implementation, not a direct migration of its codebase.

The initial core functionality is now implemented. Future development will focus on making the experience more reliable, accessible, and polished while expanding capabilities where useful.

## Contributing

Suggestions, bug reports, and contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and pull-request guidance.

## Security and privacy

Do not post real API keys, passwords, private server addresses, or personal media data in issues, tests, screenshots, or Storybook stories.

Pull-request preview builds must contain mock data only.

Service configuration and credential handling are implemented, but their security and permissions model will continue to be reviewed as part of reliability and release-readiness work.

See the [roadmap's security section](docs/ROADMAP.md#security-and-privacy) for additional design goals.

## License

Licensed under the [MIT License](LICENSE).
