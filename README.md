# MediaManagarr

**Your self-hosted media ecosystem, all in one place.**

MediaManagarr is an open-source browser extension that brings your self-hosted media services together in a unified interface.

Built with Vue 3, TypeScript, and Vite, the project focuses on accessibility, privacy, reliability, and browser compatibility.

> [!IMPORTANT]
> MediaManagarr is in early development and is not yet considered production-ready. Browser compatibility testing is ongoing, and the extension is not currently available through browser extension stores.

## Documentation

- [User Guide](docs/USER-GUIDE.md) — Installation, service configuration, API keys, and browser-specific settings.
- [Architecture](docs/ARCHITECTURE.md) — Service registry, navigation features, and application structure.
- [Contributing](CONTRIBUTING.md) — Development conventions, testing, and pull requests.
- [Component Library](https://yansudeansu.github.io/mediamanagarr/) — Storybook documentation for reusable UI components.
- [Privacy Policy](PRIVACY.md) — Local storage, service communication, and third-party image requests.

## Getting started

### Requirements

Install [Node.js](https://nodejs.org/) 26.x and its bundled npm.

The release workflow builds on Ubuntu using Node.js 26. Use `npm ci` to install the dependency versions recorded in `package-lock.json`.

### Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/yansudeansu/mediamanagarr.git
cd mediamanagarr
npm ci
```

Start the development server:

```bash
npm run start
```

The development server runs the Vue application. Browser-extension functionality must be tested using a built extension.

### Build the extension

After installing dependencies, build both browser targets:

```bash
npm run build
```

Or build a specific target:

```bash
npm run build:firefox
```

```bash
npm run build:chrome
```

Build output is written to `dist/firefox/` and `dist/chrome/`.

To load a development build into your browser, follow the [installation instructions](docs/USER-GUIDE.md#installation).

### Build from a release source archive

Download the source archive for the release tag you want to build from [GitHub Releases](https://github.com/yansudeansu/mediamanagarr/releases).

Extract the archive and open a terminal in the extracted project directory containing `package.json` and `package-lock.json`.

Install dependencies and build Firefox:

```bash
npm ci
npm run build:firefox
```

The Firefox output is written to `dist/firefox/`.

To build Chrome instead:

```bash
npm run build:chrome
```

The Chrome output is written to `dist/chrome/`.

The browser-specific release ZIPs contain the contents of the corresponding output directory, with `manifest.json` at the ZIP root. GitHub's automatically generated source archives contain the project source and must be built before they can be loaded as extensions.

## Testing and quality assurance

MediaManagarr uses Vitest for unit and component testing, Storybook for component development and accessibility tooling, and Playwright for browser-level end-to-end testing.

### Unit and component tests

Run the test suite:

```bash
npm run test
```

For watch mode, use `npm run test:watch`.

### End-to-end tests

Playwright tests exercise the built Chromium extension in an installed-extension environment, including application navigation and service configuration workflows.

Build the extension before running the tests:

```bash
npm run build:chrome
npm run test:e2e:chromium
```

**Browser coverage:** Installed-extension E2E tests currently run against Chromium. Firefox has a dedicated production build, but the current Playwright setup does not automate the installed Firefox extension.

Chromium E2E results do not establish Firefox compatibility. Firefox-specific behavior requires manual verification.

### Code quality

Run the full project verification workflow:

```bash
npm run check
```

This checks linting, formatting, unit and component tests, and production builds for both browser targets.

Chromium extension E2E tests run separately and are included in CI for pull requests targeting `master`.

See [Contributing](CONTRIBUTING.md) for individual commands and pull-request guidelines.

## Development commands

| Command                     | Description                                |
| --------------------------- | ------------------------------------------ |
| `npm run start`             | Start the development server               |
| `npm run lint`              | Check code with ESLint                     |
| `npm run lint:fix`          | Automatically fix supported lint issues    |
| `npm run format`            | Format source files                        |
| `npm run format:check`      | Check formatting without modifying files   |
| `npm run test`              | Run unit and component tests               |
| `npm run test:watch`        | Run tests in watch mode                    |
| `npm run test:e2e:chromium` | Run Chromium installed-extension E2E tests |
| `npm run build`             | Build both browser targets                 |
| `npm run build:chrome`      | Build the Chromium extension               |
| `npm run build:firefox`     | Build the Firefox extension                |
| `npm run storybook`         | Start Storybook                            |
| `npm run build-storybook`   | Build static Storybook documentation       |
| `npm run check`             | Run the project verification workflow      |

Run `npm run check` before submitting a pull request.

## Releases

MediaManagarr provides browser-specific ZIP archives through [GitHub Releases](https://github.com/yansudeansu/mediamanagarr/releases).

Available archives follow this naming convention:

```text
mediamanagarr-vX.Y.Z-firefox.zip
mediamanagarr-vX.Y.Z-chrome.zip
```

These archives contain browser-specific extension builds for testing and store submission.

The Firefox ZIP provided on GitHub is unsigned. Publishing a GitHub release does not sign the extension or publish it to a browser extension store.

See the [User Guide](docs/USER-GUIDE.md#installation) for installation instructions.

## Contributing

Contributions, bug reports, and suggestions are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and pull-request guidelines.

## Security and privacy

Never include real API keys, passwords, private server addresses, or personal media data in issues, tests, screenshots, or Storybook stories.

See the [Privacy Policy](PRIVACY.md) for details about local storage, communication with configured services, background requests, and third-party poster images.

## License

Licensed under the [MIT License](LICENSE).
