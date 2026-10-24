# MediaManagarr Development Roadmap

> **Status:** Early development. Everything described here is planned unless explicitly identified as implemented. Milestones describe intended outcomes, not fixed delivery dates.

## Vision

MediaManagarr is a new Vue 3 + TypeScript + Vite browser-extension project inspired by Media Monitor v1.0.0. It will provide a unified interface for Jellyfin, Seerr, Sonarr, Radarr, and qBittorrent, with accessible UI, reusable components, automated tests, and platform-specific behavior behind adapters.

The original Media Monitor project remains separate and is used to understand behavior and edge cases, not as an architecture to migrate wholesale.

## Principles

1. Implement small, testable increments.
2. Build shared components before duplicating UI.
3. Keep views separate from service networking.
4. Add tests, accessibility checks, and documentation alongside features.
5. Support Firefox, Zen Browser, and Chromium browsers without assuming their extension APIs behave identically.
6. Protect credentials and require confirmation for destructive operations.
7. Add dependencies only when they provide meaningful value.

## Technology and workflow

| Area                     | Choice                                      |
| ------------------------ | ------------------------------------------- |
| Package management       | npm and committed `package-lock.json`       |
| UI                       | Vue 3, TypeScript, Vite                     |
| Architecture             | Atomic Design; `src/views/` for screens     |
| Unit and component tests | Vitest, Vue Test Utils                      |
| Browser testing          | Playwright or Cypress (to be evaluated)     |
| Accessibility            | WCAG 2.2 AA target, axe-core, manual checks |
| Documentation            | Storybook and GitHub Pages                  |
| Code quality             | ESLint, Prettier, strict TypeScript         |
| CI                       | GitHub Actions, default branch `master`     |
| License                  | MIT                                         |

The build handles TypeScript validation; a separate `typecheck` command is not initially required. Use npm exclusively.

## Proposed architecture

The structure below is illustrative; create directories only as needed.

```text
src/
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
├── styles/
│   ├── tokens.css
│   └── global.css
├── types/
├── App.vue
└── main.ts
```

**Atoms** are basic controls such as buttons, badges, and inputs. **Molecules** combine atoms, such as form fields and filters. **Organisms** are larger sections such as media cards, calendar grids, and service panels. **Templates** define reusable layouts. **Views** compose these elements into complete screens and coordinate application state.

## Platforms

The initial release targets a browser extension for Firefox, Zen Browser, Chrome, and compatible Chromium browsers. Components and views should not call extension APIs directly; platform adapters should handle storage, permissions, background messaging, and other browser-specific behavior. Manifest V3, host permissions, network requests, and packaging require browser-specific verification.

Evaluate WXT against a custom Vite-based extension setup before committing to an extension architecture. A standalone web app is a possible future goal, but CORS, mixed content, authentication, HTTPS, and access to local servers make it unsuitable as an initial requirement.

## Design system and accessibility

Use a dark interface with green accents inspired by Media Monitor, refined through shared tokens for color, typography, spacing, radii, focus, motion, and responsive sizing. Introduce components as features need them rather than implementing a catalog up front.

Aim for WCAG 2.2 AA where applicable. Provide semantic HTML, keyboard access, visible focus, labeled inputs, accessible icon buttons, status announcements, sufficient contrast, reduced-motion support, and appropriate dialog focus management. Use axe-core and Storybook accessibility tooling alongside manual keyboard and periodic screen-reader testing. Automated checks cannot replace manual review.

## Testing and documentation

Use Vitest for calculations, transformations, status mapping, API handling, and notification logic. Use Vue Test Utils for rendering, events, loading and error states, forms, and keyboard interactions. Mock service API responses for success, authentication failures, network errors, and malformed data.

Evaluate Playwright or Cypress for browser automation, recognizing that testing a popup page is not the same as testing a packaged extension with permissions, storage, and background messaging. Prioritize meaningful test coverage, especially for destructive actions.

Storybook should document each reusable component's purpose, props, events, variants, interaction states, accessibility requirements, and examples. Publish only mock data—never credentials or private server addresses. Deploy its static build to GitHub Pages using GitHub Actions after the relevant checks pass on `master`.

## Milestone 0 — Repository and development infrastructure

**Goal:** A clean checkout can install dependencies, pass automated checks, and build successfully.

- Create the GitHub repository and configure `master`.
- Initialize Vue 3, TypeScript, Vite, and npm.
- Add README, MIT license, `.gitignore`, `.editorconfig`, and contributing guidance.
- Configure strict TypeScript, ESLint, Prettier, and Vitest.
- Add lint, format, test, and build scripts.
- Configure GitHub Actions with `npm ci`, dependency caching, and quality checks.
- Verify CI on a clean checkout.
- Establish branch and pull-request conventions.
- Evaluate WXT versus a custom Vite extension setup (may continue into the application-shell milestone).

## Milestone 1 — Storybook and documentation infrastructure

**Goal:** A tested component is documented in Storybook and automatically published.

- Install Storybook for Vue 3 and Vite.
- Introduce initial design tokens and a reusable component.
- Add component stories, interaction states, and a component test.
- Enable Storybook accessibility tooling.
- Add production Storybook builds.
- Configure GitHub Pages and a GitHub Actions deployment workflow from `master`.
- Verify the published site and document local Storybook commands.

## Milestone 2 — Design system and application shell

**Goal:** A working, accessible application shell with documented shared components.

- Define colors, typography, spacing, radii, focus, responsiveness, and interaction states.
- Build buttons, icon buttons, badges, inputs, checkboxes, selects, spinners, progress indicators, pagination, dialogs, and empty/error states as needed.
- Create navigation, active-view states, popup sizing, and application layout.
- Introduce the platform abstraction and verify basic browser execution.
- Add component tests, stories, and keyboard checks.

## Milestone 3 — Settings and service configuration

**Goal:** Users can configure services and understand connection failures.

- Build service configuration forms, validation, connection indicators, and test feedback.
- Store URLs and API credentials securely according to the selected platform model.
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

**Goal:** Reproducible, tested browser packages and a documented release process.

- Build and validate browser-specific packages and manifests.
- Test Firefox, Zen Browser, and Chrome compatibility.
- Exclude development files; establish versioning and changelog conventions.
- Investigate Firefox Add-ons and Chrome Web Store requirements.
- Document signing, manual installation, and updates.
- Automate release artifacts and publish GitHub releases.
- Add issue/PR templates, a security policy, dependency updates, and support guidance.

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

The exact storage, authentication, and permission model will be determined during implementation.

## Future possibilities

A standalone web application, more integrations, flexible dashboards, richer notifications, improved theming, service-health monitoring, and cross-service activity tracking may be explored after the core extension is stable.

## Completion standard

A feature is complete when its relevant behavior works, tests pass, keyboard/accessibility requirements are checked, documentation is updated, and supported-browser differences have been considered.
