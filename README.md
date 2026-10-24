# MediaManagarr

**Your self-hosted media ecosystem, all in one place.**

MediaManagarr is an open-source, cross-browser companion for monitoring and managing self-hosted media services from a unified interface. It is being built with Vue 3, TypeScript, and Vite, with an emphasis on accessibility, reusable components, privacy, and automated testing.

> [!IMPORTANT]
> **Early development:** MediaManagarr is not yet ready for everyday use. The integrations below are planned, not implemented.

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

## Technology

| Area                    | Tool                        |
| ----------------------- | --------------------------- |
| Framework               | Vue 3                       |
| Language                | TypeScript                  |
| Build                   | Vite                        |
| Package manager         | npm                         |
| Testing                 | Vitest and Vue Test Utils   |
| Linting and formatting  | ESLint and Prettier         |
| CI                      | GitHub Actions              |
| Component documentation | Storybook                   |
| Accessibility tooling   | Storybook a11y and axe-core |

## Getting started

### Requirements

Install a Node.js version supported by the engines declared in `package.json`, along with npm.

```bash
git clone https://github.com/yansudeansu/mediamanagarr.git
cd mediamanagarr
npm ci
npm run dev
```

### Development commands

```bash
npm run dev
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run test
npm run test:watch
npm run build
npm run storybook
npm run build-storybook
```

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

### Component conventions

Components follow Atomic Design principles and are organized by responsibility:

- **Atoms:** Basic UI elements such as buttons, badges, and inputs.
- **Molecules:** Combinations of atoms, such as form fields and filters.
- **Organisms:** Larger interface sections, such as media cards and service panels.
- **Templates:** Reusable page and application layouts.

Each reusable component keeps its implementation, Storybook stories, and component tests together.

For example:

```text
src/components/atoms/Button/
├── Button.vue
├── Button.stories.ts
└── Button.test.ts
```

Stories should demonstrate relevant variants, interaction states, and accessibility considerations. Component tests should cover meaningful behavior rather than implementation details.

### Accessibility

Storybook includes accessibility tooling powered by axe-core to identify potential issues such as missing accessible names, insufficient color contrast, and invalid ARIA attributes.

Automated checks are supplemented by manual keyboard and visual testing, with WCAG 2.2 AA as the accessibility target.

## Roadmap

Development is organized into incremental milestones, starting with project tooling and CI, followed by Storybook, the design system, service configuration, integrations, browser testing, and distribution.

**Milestone 0 (repository infrastructure) and Milestone 1 (Storybook infrastructure) are complete.** Development will continue with the design system and application shell.

Read the [full roadmap](docs/ROADMAP.md) for planned milestones, architecture, accessibility, and testing strategy.

## Architecture

Reusable components follow Atomic Design, while complete screens live in `src/views/`. Service API logic and browser-specific adapters remain separate from presentation components. Directories are added as they become necessary.

## Background

MediaManagarr is inspired by the existing **Media Monitor** browser extension, which serves as a functional reference. MediaManagarr is a separate implementation, not a direct migration of its codebase.

## Contributing

Suggestions, bug reports, and contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and pull request guidance.

## Security and privacy

Do not post real API keys, passwords, private server addresses, or personal media data in issues, tests, screenshots, or Storybook stories. See the [roadmap's security section](docs/ROADMAP.md#security-and-privacy) for design goals; the final credential storage and permissions model has not yet been implemented.

## License

Licensed under the [MIT License](LICENSE).
