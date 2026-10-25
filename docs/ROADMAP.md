# MediaManagarr Development Roadmap

> **Status:** Early development. Milestones 0, 1, and 2 are complete. Milestone 2.5 is in progress and establishes Git workflow safeguards, pull-request tooling, and release automation before service integrations begin. Remaining milestones describe planned outcomes, not fixed delivery dates.

## Vision

MediaManagarr is a Vue 3 + TypeScript + Vite browser extension inspired by Media Monitor v1.0.0. It provides a foundation for a unified interface for Jellyfin, Seerr, Sonarr, Radarr, and qBittorrent, with accessible UI, reusable components, automated tests, and platform-specific behavior behind adapters.

The original Media Monitor project remains separate and serves as a reference for behavior and edge cases, not as an architecture to migrate wholesale.

## Principles

1. Implement small, testable increments.
2. Build shared components before duplicating UI.
3. Keep views separate from service networking.
4. Add tests, accessibility checks, and documentation alongside features.
5. Support Firefox, Zen Browser, and Chromium browsers without assuming their extension APIs behave identically.
6. Protect credentials and require confirmation for destructive operations.
7. Add dependencies only when they provide meaningful value.
8. Keep the default branch stable through automated checks and reviewed changes.
9. Use consistent versioning, commit conventions, and release documentation.
10. Prefer developer guidance over unnecessary workflow restrictions.
11. Keep release publishing intentional rather than automatic on every merge.

## Technology and workflow

| Area                     | Choice                                      |
| ------------------------ | ------------------------------------------- |
| Package management       | npm and committed `package-lock.json`       |
| UI                       | Vue 3, TypeScript, Vite                     |
| Extension architecture   | Custom Vite build, Manifest V3              |
| Architecture             | Atomic Design; `src/views/` for screens     |
| Unit and component tests | Vitest, Vue Test Utils                      |
| Browser testing          | Playwright or Cypress (to be evaluated)     |
| Accessibility            | WCAG 2.2 AA target, axe-core, manual checks |
| Documentation            | Storybook and GitHub Pages                  |
| Code quality             | ESLint, Prettier, strict TypeScript         |
| CI                       | GitHub Actions, default branch `master`     |
| Commit conventions       | Conventional Commits                        |
| Commit validation        | Commitlint                                  |
| Local Git hooks          | Husky v9                                    |
| Release automation       | To be selected; Release Please candidate    |
| Versioning               | Semantic Versioning                         |
| Changelog                | Automated `CHANGELOG.md` (planned)          |
| License                  | MIT                                         |

The build handles TypeScript validation; a separate `typecheck` command is not initially required. Use npm exclusively.

### Development workflow

The intended contribution workflow is:

1. Create a feature, fix, or documentation branch from `master`.
2. Make small, focused changes.
3. Write tests and update documentation alongside the implementation.
4. Use Conventional Commits for commit messages.
5. Run local checks before pushing.
6. Open a pull request targeting `master`.
7. Complete the pull-request template.
8. Review automated quality checks and release-impact feedback.
9. Inspect a Storybook preview when UI changes are involved.
10. Merge after required checks pass and relevant conversations are resolved.

Use `master` as the single long-lived development branch.

Feature branches are temporary and may be amended or rebased before merging.

The repository may allow merge commits, squash merges, and rebase merges. Contributors should choose an appropriate method while preserving meaningful Conventional Commit history.

Never force-push to `master` or delete the default branch.

Local Git hooks provide early feedback but are not a security boundary. GitHub repository rulesets and required CI checks provide server-side enforcement where supported by the repository's GitHub plan.

### Commit conventions

Use Conventional Commits:

```text
feat: add service connection form
fix: correct popup scrolling
docs: update development roadmap
refactor: simplify navigation state
test: cover connection failures
chore: update extension icons
ci: improve GitHub Actions workflow
```

Breaking changes use `!` or a `BREAKING CHANGE:` footer.

The repository uses Commitlint with `@commitlint/config-conventional`.

Husky validates commit messages locally through `.husky/commit-msg`.

Contributors may amend or rebase commits on their own branches.

The contributing guide should explain how merge commits, squash merges, and rebase merges affect release automation.

A squash commit should use a valid Conventional Commit message. Individual commits preserved through merge or rebase should also follow the convention.

Pull-request titles should follow Conventional Commits so that they provide a useful summary and can be validated independently.

### Local quality checks

The repository uses Husky v9 with:

- `.husky/commit-msg` to validate commit messages.
- `.husky/pre-push` to run the project quality checks.
- `prepare` in `package.json` to initialize Git hooks after installation.

The shared quality command is:

```bash
npm run check
```

It runs:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

The production Storybook build is handled separately by the Storybook workflow.

Local hooks may be bypassed, so required CI checks remain necessary.

### Pull requests and contributor experience

Pull requests should provide a consistent, useful experience without introducing unnecessary restrictions.

Planned improvements include:

- A repository pull-request template.
- A clear description of the proposed changes.
- Links to related issues where applicable.
- Testing and verification notes.
- Accessibility considerations for UI changes.
- Browser compatibility notes when relevant.
- Screenshots or Storybook previews for visual changes.
- A checklist for documentation and test updates.

The template should be concise enough to remain useful for small changes.

PR automation should:

- Validate the pull-request title.
- Validate Conventional Commit messages.
- Report the expected semantic-version impact.
- Explain which commits contributed to that result.
- Provide clear feedback when validation fails.
- Avoid modifying application versions or publishing releases.

The release-impact report should distinguish between:

1. **PR impact:** The version bump contributed by the pull request.
2. **Next-release impact:** The bump implied by all unreleased changes, including the pull request.

These values may differ when other unreleased changes already exist on `master`.

### Semantic-version impact reporting

Use Conventional Commit metadata to predict release impact.

| Change type     | Default impact                    |
| --------------- | --------------------------------- |
| Breaking change | Major                             |
| `feat:`         | Minor                             |
| `fix:`          | Patch                             |
| `perf:`         | Patch                             |
| `docs:`         | None                              |
| `test:`         | None                              |
| `chore:`        | None                              |
| `ci:`           | None                              |
| `refactor:`     | None unless explicitly configured |

A documented pre-1.0 policy may adjust the resulting version numbers.

The PR workflow and actual release workflow should use the same release-analysis rules to avoid conflicting predictions.

A PR summary might display:

```text
MediaManagarr — PR Release Impact

Pull request: feat: add Jellyfin configuration

Commits analyzed: 4

Features:         1
Fixes:            2
Breaking changes: 0
Other changes:    1

PR release impact: MINOR
```

The report is informational until its accuracy and behavior have been verified.

Validation failures should block merging only after the workflow has been tested and added to the repository's required checks.

### Pull-request Storybook previews

Storybook previews should help contributors review component changes before merging.

The existing production Storybook deployment uses GitHub Pages' artifact-based deployment workflow.

Preserve the working production deployment while introducing previews incrementally.

**Initial preview approach:**

- Build Storybook for pull requests.
- Upload the generated Storybook site as a downloadable GitHub Actions artifact.
- Make the artifact easy to find from the PR.
- Avoid publishing or overwriting the production Storybook site.
- Ensure preview builds contain mock data only.

**Future hosted preview approach:**

- Publish temporary Storybook previews for eligible pull requests.
- Provide a preview URL directly in the PR.
- Use a unique preview path or deployment per pull request.
- Update the preview when the PR changes.
- Remove the preview when the PR closes or merges.
- Preserve the main Storybook deployment.
- Handle concurrent preview deployments safely.
- Configure asset paths correctly for nested preview URLs.
- Avoid exposing repository write credentials to untrusted PR code.
- Define a safe policy for external fork contributions.

Potential hosting approaches include a dedicated Pages publishing branch or a separate preview-hosting service.

GitHub Pages' standard artifact deployment should not be treated as an independent per-PR preview environment.

Choose a hosting approach only after evaluating deployment complexity, security, cleanup, and maintenance.

### Versioning and releases

Use Semantic Versioning:

- **Patch:** Backward-compatible bug fixes.
- **Minor:** Backward-compatible features.
- **Major:** Breaking changes.

During early development, follow a documented `0.x.y` versioning policy rather than assuming that every breaking change must immediately produce `1.0.0`.

`package.json` is the source of truth for the application version. The Vite build synchronizes the generated extension manifest with that version.

Release automation should:

- Analyze merged changes using Conventional Commits.
- Determine the next version from commits since the previous release tag.
- Propose version updates.
- Generate or update `CHANGELOG.md`.
- Keep `package.json` and `package-lock.json` synchronized.
- Create version tags.
- Publish GitHub Releases.
- Avoid unnecessary releases for documentation-only or maintenance changes.
- Prevent duplicate releases and accidental version changes.

**Releases are manually initiated.**

Merging a pull request into `master` must not automatically publish a new release.

Because `master` requires pull requests, version and changelog updates should follow the repository's branch-protection requirements.

A possible release process is:

1. Manually trigger the release workflow.
2. Analyze unreleased Conventional Commits.
3. Determine the proposed version.
4. Generate version and changelog updates.
5. Open a release pull request.
6. Run required checks.
7. Merge the release pull request.
8. Create the corresponding Git tag and GitHub Release.

The exact process depends on the selected release tool and must avoid accidental publication before the release is approved.

Evaluate tools based on their support for manually triggered releases, protected branches, Conventional Commits, changelog generation, and GitHub Releases.

The initial release process may publish source releases without browser-store packages. Signed extension packages and store distribution are addressed in Milestone 12.

## Proposed architecture

The structure below is illustrative; create directories only as needed.

```text
public/
├── icons/
│   ├── icon.svg
│   ├── icon-16.png
│   ├── icon-32.png
│   ├── icon-48.png
│   └── icon-128.png
└── manifest.json

src/
├── assets/
│   └── mm-logo.svg
├── views/
│   ├── SettingsView.vue
│   ├── RequestsView.vue
│   ├── UpNextView.vue
│   ├── CalendarView.vue
│   └── DownloadsView.vue
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── composables/
├── services/
│   ├── jellyfin/
│   ├── seerr/
│   ├── sonarr/
│   ├── radarr/
│   └── qbittorrent/
├── platform/
│   ├── contracts/
│   ├── extension/
│   └── web/
├── stories/
│   ├── Introduction.mdx
│   └── DesignTokens.mdx
├── styles/
│   ├── tokens.css
│   └── global.css
├── types/
├── utils/
│   └── version.ts
├── App.vue
└── main.ts
```

Additional repository infrastructure may include:

```text
.github/
├── PULL_REQUEST_TEMPLATE.md
└── workflows/
    ├── ci.yml
    ├── storybook.yml
    ├── pr.yml
    ├── preview.yml
    └── release.yml

.husky/
├── commit-msg
└── pre-push

commitlint.config.ts
CHANGELOG.md
```

These filenames are illustrative. Preserve existing workflow filenames and avoid creating duplicate workflows.

**Atoms** are basic controls such as buttons, badges, and inputs. **Molecules** combine atoms, such as form fields and filters. **Organisms** are larger sections such as media cards, calendar grids, and service panels. **Templates** define reusable layouts. **Views** compose these elements into complete screens and coordinate application state.

The existing application shell uses `MmHeader`, `MmNavigation`, and `MmFooter` molecules, with `MmButton` and `MmIcon` atoms. Components are developed incrementally with colocated tests and Storybook stories.

## Platforms

The initial release targets a browser extension for Firefox, Zen Browser, Chrome, and compatible Chromium browsers.

**Architecture decision:** Use a custom Vite-based extension setup rather than WXT. The existing Vue/Vite application builds directly into a Manifest V3 extension without additional extension-framework dependencies.

The extension currently uses:

- `public/manifest.json` as the manifest template.
- `index.html` as the popup entry point.
- Relative asset paths through Vite's `base: './'` configuration.
- SVG artwork for the application branding.
- PNG extension icons generated from the SVG source for cross-browser compatibility.
- A small Vite plugin that synchronizes the generated manifest version with `package.json`.

The application shell has been loaded and visually verified in both Zen Browser and Chrome.

Components and views should not call extension APIs directly. Future platform adapters should handle storage, permissions, background messaging, and other browser-specific behavior.

Manifest V3, host permissions, network requests, background behavior, and packaging will require additional browser-specific verification as integrations are implemented.

A standalone web app remains a possible future goal, but CORS, mixed content, authentication, HTTPS, and access to local servers make it unsuitable as an initial requirement.

## Design system and accessibility

MediaManagarr uses a dark interface with green accents inspired by Media Monitor.

Shared CSS tokens define the initial color palette, typography, radii, and interaction styling. The component library will expand as features require additional controls.

The application shell currently provides:

- Consistent branding using the MM logo.
- Shared header actions for settings and back navigation.
- Navigation between Requests, Up Next, Calendar, and Downloads.
- Active-view indicators.
- A settings placeholder.
- A persistent footer displaying the application version.
- Fixed popup dimensions with a scrollable content region.

Aim for WCAG 2.2 AA where applicable. Provide semantic HTML, keyboard access, visible focus, labeled inputs, accessible icon buttons, status announcements, sufficient contrast, reduced-motion support, and appropriate dialog focus management.

Use axe-core and Storybook accessibility tooling alongside manual keyboard and periodic screen-reader testing. Automated checks cannot replace manual review.

## Testing and documentation

Use Vitest for calculations, transformations, status mapping, API handling, and notification logic. Use Vue Test Utils for rendering, events, loading and error states, forms, and keyboard interactions.

Mock service API responses for success, authentication failures, network errors, and malformed data.

Evaluate Playwright or Cypress for browser automation, recognizing that testing a popup page is not the same as testing a packaged extension with permissions, storage, and background messaging.

Prioritize meaningful test coverage, especially for destructive actions.

Storybook is configured for Vue 3 and Vite, with accessibility checks powered by axe-core.

The component library currently includes documented atoms and molecules, including:

- `MmButton`
- `MmIcon`
- `MmHeader`
- `MmNavigation`
- `MmFooter`

Storybook also includes:

- A branded Introduction page.
- A Design Tokens foundations page.
- Dark-themed documentation.
- Colocated component stories and tests.

Future reusable components should document their purpose, props, events, variants, interaction states, accessibility requirements, and examples.

The component library is automatically built and deployed to GitHub Pages through GitHub Actions when changes are pushed to `master`.

The production Storybook deployment currently uses `actions/upload-pages-artifact` and `actions/deploy-pages`.

Pull-request Storybook previews are planned separately and must not overwrite the production site.

Publish only mock data—never credentials or private server addresses.

## Milestone 0 — Repository and development infrastructure ✅ Complete

**Goal:** A clean checkout can install dependencies, pass automated checks, and build successfully.

- [x] Create the GitHub repository and configure `master`.
- [x] Initialize Vue 3, TypeScript, Vite, and npm.
- [x] Add README, MIT license, `.gitignore`, `.editorconfig`, and contributing guidance.
- [x] Configure strict TypeScript, ESLint, Prettier, and Vitest.
- [x] Add lint, format, test, and build scripts.
- [x] Configure GitHub Actions with `npm ci`, dependency caching, and quality checks.
- [x] Verify CI on a clean checkout.
- [x] Establish branch and pull-request conventions.

**Deferred to Milestone 2:** Evaluate WXT versus a custom Vite extension setup before implementing the application shell.

## Milestone 1 — Storybook and documentation infrastructure ✅ Complete

**Goal:** A tested component is documented in Storybook and automatically published.

- [x] Install Storybook for Vue 3 and Vite.
- [x] Introduce initial design tokens and a reusable `Button` atom.
- [x] Add component stories, interaction states, and component tests.
- [x] Enable Storybook accessibility tooling with axe-core.
- [x] Verify initial component stories pass automated accessibility checks.
- [x] Add production Storybook builds.
- [x] Configure GitHub Pages and a GitHub Actions deployment workflow from `master`.
- [x] Verify the published component library.
- [x] Document local Storybook commands and component conventions in the README.

**Published component library:** MediaManagarr Storybook on GitHub Pages.

## Milestone 2 — Design system and application shell ✅ Complete

**Goal:** A working, accessible application shell with documented shared components.

### Design system

- [x] Establish the initial dark color palette and green accent.
- [x] Define shared CSS tokens for typography, colors, radii, and interaction styling.
- [x] Implement the `MmButton` atom with variants, sizes, icons, loading, and disabled states.
- [x] Implement the `MmIcon` atom using Lucide icons.
- [x] Create the `MmHeader` molecule with branding and settings/back actions.
- [x] Create the `MmNavigation` molecule with active-view states.
- [x] Create the `MmFooter` molecule with branding and version information.
- [x] Add component tests and Storybook stories.
- [x] Add branded Introduction and Design Tokens documentation pages.

### Application shell

- [x] Assemble the application shell in `App.vue`.
- [x] Implement navigation between Requests, Up Next, Calendar, and Downloads placeholders.
- [x] Add a settings placeholder with back navigation.
- [x] Implement fixed popup dimensions.
- [x] Make the main content area scroll independently of the header, navigation, and footer.
- [x] Verify popup rendering and scrolling in Zen Browser.
- [x] Verify popup rendering and scrolling in Chrome.

### Browser extension

- [x] Evaluate WXT versus custom Vite and select custom Vite.
- [x] Configure the Manifest V3 popup entry point.
- [x] Use relative asset paths for extension compatibility.
- [x] Create extension icons from the MM SVG logo.
- [x] Verify SVG and PNG icon behavior across browsers.
- [x] Load the unpacked extension in Chrome.
- [x] Load the temporary extension in Zen Browser.
- [x] Synchronize the generated manifest version with `package.json`.
- [x] Display the application version in the popup footer.
- [x] Introduce platform adapters when storage, permissions, or background messaging are first required.

### Final verification

- [x] Run ESLint successfully.
- [x] Pass Prettier formatting checks.
- [x] Pass all Vitest tests.
- [x] Complete a production Vite build.
- [x] Complete a production Storybook build.
- [x] Perform final keyboard and accessibility checks.

## Milestone 2.5 — Git workflow, pull requests, and release automation 🚧 In progress

**Goal:** Protect the default branch, standardize commits, improve pull-request feedback, and automate versioning and release documentation.

### Commit conventions

- [x] Adopt Conventional Commits for development.
- [x] Install and configure Commitlint.
- [x] Use `@commitlint/config-conventional`.
- [x] Configure Commitlint using `commitlint.config.ts`.
- [x] Configure a local `commit-msg` hook.
- [x] Verify that commit-message validation works.
- [ ] Document commit conventions in the contributing guide.
- [ ] Document how merge methods affect release analysis.

### Local quality safeguards

- [x] Install and configure Husky v9.
- [x] Configure the `prepare` script.
- [x] Add a pre-push hook running `npm run check`.
- [x] Include lint, formatting, tests, and production build in `npm run check`.
- [x] Verify the local Git hooks are installed.
- [ ] Verify hooks after a clean `npm ci`.
- [ ] Document how to run checks manually.
- [ ] Confirm that failing checks prevent a normal push.

### GitHub branch protection

- [ ] Create and activate a repository ruleset for `master`.
- [ ] Block force pushes to `master`.
- [ ] Prevent deletion of `master`.
- [ ] Require pull requests before merging.
- [ ] Allow merge, squash, and rebase methods.
- [ ] Require successful CI checks before merging.
- [ ] Require resolution of PR conversations before merging.
- [ ] Verify the `Lint, Format, Test and Build` check is required.
- [ ] Verify that failing checks block merges.
- [ ] Document any repository-plan limitations affecting enforcement.

### Pull-request templates and guidance

- [ ] Create `.github/PULL_REQUEST_TEMPLATE.md`.
- [ ] Include a concise change summary.
- [ ] Include related issues and testing notes.
- [ ] Include accessibility and browser-compatibility considerations.
- [ ] Include optional screenshots or Storybook preview references.
- [ ] Document PR titles and Conventional Commit conventions.
- [ ] Document amending and rebasing feature branches.
- [ ] Document supported merge methods.
- [ ] Test the template with a real pull request.

### Pull-request validation and release-impact reporting

- [ ] Add a PR-specific GitHub Actions workflow.
- [ ] Validate PR titles against Conventional Commits.
- [ ] Validate individual commit messages.
- [ ] Determine PR release impact from Conventional Commits.
- [ ] Report major, minor, patch, or no release impact.
- [ ] Include a clear GitHub Actions job summary.
- [ ] Distinguish PR impact from the overall next-release impact.
- [ ] Reuse the release workflow's analysis rules.
- [ ] Verify behavior for breaking changes.
- [ ] Verify behavior for documentation-only changes.
- [ ] Verify behavior with merge, squash, and rebase strategies.
- [ ] Add validated PR checks to the required status checks.

### Storybook pull-request previews

- [ ] Build Storybook for pull requests.
- [ ] Upload Storybook builds as downloadable workflow artifacts.
- [ ] Make preview artifacts easy to find from the PR.
- [ ] Ensure preview builds do not overwrite production Storybook.
- [ ] Verify previews contain no private credentials or server addresses.

**Hosted preview enhancement:**

- [ ] Evaluate hosting approaches for temporary PR previews.
- [ ] Support a unique preview URL for each eligible PR.
- [ ] Add the preview URL to the pull request.
- [ ] Update previews when PR changes are pushed.
- [ ] Automatically remove previews when PRs close.
- [ ] Preserve the production Storybook site.
- [ ] Prevent concurrent deployments from overwriting each other.
- [ ] Verify nested asset paths work.
- [ ] Define a safe policy for forked PRs.
- [ ] Document preview limitations and maintenance requirements.

### Versioning and changelog

- [ ] Use `master` as the single long-lived branch for releases.
- [ ] Adopt Semantic Versioning with a documented pre-1.0 policy.
- [ ] Track releases using Git tags.
- [ ] Determine the next version from commits since the previous release.
- [ ] Support manually triggered releases through GitHub Actions.
- [ ] Evaluate release tools, including Release Please, for this workflow.
- [ ] Ensure release automation respects protected-branch requirements.
- [ ] Generate and maintain `CHANGELOG.md`.
- [ ] Keep `package.json` and `package-lock.json` synchronized.
- [x] Preserve automatic manifest-version synchronization.
- [ ] Avoid version bumps when no qualifying changes exist.

### Tags and GitHub Releases

- [ ] Create Git tags from validated releases on `master`.
- [ ] Publish GitHub Releases with generated release notes.
- [ ] Ensure release automation only publishes commits from `master`.
- [ ] Prevent duplicate tags and releases.
- [ ] Ensure all required checks pass before publishing.
- [ ] Document required GitHub Actions permissions.
- [ ] Test release automation without publishing an unintended release.
- [ ] Verify that merging ordinary PRs does not trigger releases.

## Milestone 3 — Settings and service configuration

**Goal:** Users can configure services and understand connection failures.

- Build service configuration forms, validation, connection indicators, and test feedback.
- Store URLs and API credentials securely according to the selected platform model.
- Introduce platform adapters for extension storage and permissions.
- Support optional integrations, connection tests, and browser permissions.
- Handle authentication and network errors without logging credentials.
- Add tests, Storybook stories, and cross-browser verification.

**Media Monitor reference:** Settings, storage, host permissions, and connection tests.

## Milestone 4 — Requests (Seerr)

**Goal:** Browse media requests through accessible, documented components.

- Implement request cards, status badges, filters, pagination, and empty/error states.
- Fetch requests and display metadata and statuses.
- Handle loading, API errors, and missing posters.
- Test status mapping, filtering, pagination, keyboard interactions, and browser compatibility.

**Media Monitor reference:** Requests UI, Seerr API, statuses, and pagination.

## Milestone 5 — Up Next (Jellyfin)

**Goal:** Browse Jellyfin media and receive reliable notifications.

- Build media cards, posters, status badges, filters, and notification indicators.
- Fetch recently added and unwatched content; support user selection.
- Add filtering, pagination, notification detection, dismissal, and stored state.
- Handle missing images and service failures.
- Test API handling, notification logic, components, and browser compatibility.

**Media Monitor reference:** Up Next, Jellyfin integration, polling, and notifications.

## Milestone 6 — Calendar (Sonarr and Radarr)

**Goal:** An accessible calendar of upcoming episodes and movies.

- Build calendar grid, day cells, navigation, release cards, filters, and indicators.
- Fetch and combine Sonarr/Radarr release data.
- Support month navigation, media-type filtering, and release details.
- Test date calculations, API responses, calendar keyboard navigation, and errors.

**Media Monitor reference:** Calendar UI, Sonarr/Radarr APIs, dates, and release grouping.

## Milestone 7 — Downloads (qBittorrent)

**Goal:** Safely monitor and manage torrents.

- Build torrent cards, progress and status indicators, transfer summaries, actions, and removal dialogs.
- Display progress, speeds, ETA, and status.
- Support start, stop, and remove operations with clear feedback and refresh.
- Preserve downloaded files by default; require explicit confirmation before deleting files.
- Support the existing Bearer-authenticated proxy setup and evaluate native qBittorrent authentication.
- Test destructive safeguards, dialogs, service errors, and browser compatibility.

**Media Monitor reference:** Downloads UI, qBittorrent API, action polling, and removal confirmation.

## Milestone 8 — Broader testing and accessibility

**Goal:** Critical workflows have reliable automated and manual coverage.

- Choose Playwright or Cypress and add browser interaction tests.
- Verify extension storage, messaging, permissions, reload behavior, and failures.
- Add cross-browser smoke tests and CI integration where practical.
- Audit keyboard navigation and WCAG 2.2 AA alignment.
- Perform manual accessibility checks and address coverage gaps.

## Milestone 9 — Service health and reliability

**Goal:** Connection problems are clear without disrupting unrelated features.

- Add health checks for configured services only.
- Distinguish authentication and network failures.
- Surface service-health and toolbar indicators where supported.
- Clear indicators after recovery and prioritize serious failures.
- Improve timeouts, retries, polling, caching, and overlapping-request handling.
- Test temporary outages.

## Milestone 10 — Feature enhancements

**Goal:** Improve the experience based on feedback and technical readiness.

- **Jellyfin:** Grouping, sorting, notification preferences, image loading, polling controls.
- **Seerr:** Additional filters, status counts, season details, sorting, possible approval actions.
- **Sonarr/Radarr:** Calendar ranges, grouping, filters, and direct links.
- **qBittorrent:** Completion notifications, sorting, stalled states, details, authentication options.
- **Cross-service:** Activity overview, related-item views, refresh settings, and future integrations.

These are candidates, not commitments for the initial release.

## Milestone 11 — Branding and documentation

**Goal:** Consistent branding and usable documentation for contributors and users.

- Refine the MM icon, wordmark, colors, artwork, screenshots, and extension icons.
- Review naming conflicts before distribution.
- Document installation, configuration, credentials, permissions, architecture, testing, and integrations.
- Add troubleshooting and contribution examples.

## Milestone 12 — Release engineering and distribution

**Goal:** Reproducible, tested browser packages and a documented distribution process.

- Build and validate browser-specific packages and manifests.
- Test Firefox, Zen Browser, and Chrome compatibility.
- Exclude development files and validate packaged contents.
- Investigate Firefox Add-ons and Chrome Web Store requirements.
- Document signing, manual installation, and updates.
- Automate extension release artifacts and attach them to GitHub Releases.
- Establish store submission and update procedures.
- Add issue templates, a security policy, dependency updates, and support guidance.

Pull-request templates, Git tags, source-code versioning, and changelog generation are established in Milestone 2.5. This milestone focuses on distributable browser-extension packages.

## Media Monitor reference project

Media Monitor v1.0.0 is a behavioral reference, not the target architecture. Potential reference locations, to verify against that repository:

| Area                        | Possible reference                         |
| --------------------------- | ------------------------------------------ |
| API integrations            | `src/api/`                                 |
| Background messaging        | `src/background/`                          |
| Shared types                | `src/shared/`                              |
| Requests, Up Next, Calendar | `src/popup/`                               |
| Downloads                   | `src/popup/downloads.ts`                   |
| Pagination                  | `src/popup/pagination.ts`                  |
| Styling                     | `src/styles/`                              |
| Extension configuration     | `manifest.json` or its build configuration |

## Security and privacy

- Do not collect analytics by default or send credentials to unrelated third parties.
- Never put real API keys in fixtures, screenshots, or Storybook stories.
- Avoid logging secrets; request only necessary extension permissions.
- Treat destructive actions conservatively, with file deletion opt-in.
- Document credential storage limitations and HTTPS/reverse-proxy considerations.
- Review dependencies and error handling.
- Treat PR preview builds as potentially untrusted when accepting external contributions.
- Do not expose deployment credentials to untrusted pull-request code.

The exact storage, authentication, and permission model will be determined during implementation.

## Future possibilities

A standalone web application, more integrations, flexible dashboards, richer notifications, improved theming, service-health monitoring, and cross-service activity tracking may be explored after the core extension is stable.

## Completion standard

A feature is complete when its relevant behavior works, tests pass, keyboard/accessibility requirements are checked, documentation is updated, and supported-browser differences have been considered.

For infrastructure changes, completion also requires verifying that safeguards behave correctly when checks fail and that release automation cannot accidentally publish an unintended release.
