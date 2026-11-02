# MediaManagarr

**Your self-hosted media ecosystem, all in one place.**

MediaManagarr is an open-source browser extension that brings your self-hosted media services together in a unified interface.

Built with Vue 3, TypeScript, and Vite, the project focuses on accessibility, privacy, reliability, and browser compatibility.

> [!IMPORTANT]
> MediaManagarr is in early development and is not yet considered production-ready. Browser compatibility testing is ongoing, and the extension is not currently available through browser extension stores.

## Documentation

- [User Guide](docs/USER-GUIDE.md) — Installation, service configuration, API keys, and browser-specific settings.
- [Contributing](CONTRIBUTING.md) — Development conventions, testing, and pull requests.
- [Roadmap](docs/ROADMAP.md) — Planned improvements and upcoming milestones.
- [Component Library](https://yansudeansu.github.io/mediamanagarr/) — Storybook documentation for reusable UI components.

## Getting started

### Requirements

Install a Node.js version supported by the engines declared in `package.json`, along with npm.

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

Build both browser targets:

```bash
npm run build
```

Or build a specific target:

```bash
npm run build:firefox
npm run build:chrome
```

Build output is written to `dist/firefox/` and `dist/chrome/`.

To load a development build into your browser, follow the [installation instructions](docs/USER-GUIDE.md#installation).

## Testing and quality assurance

MediaManagarr uses automated checks to help maintain code quality, accessibility, and reliable integration with supported media services.

The testing setup includes unit and component tests, Storybook for component development, and Playwright end-to-end tests.

### Unit and component tests

Run the test suite:

```bash
npm run test
```

Or run tests in watch mode:

```bash
npm run test:watch
```

### End-to-end tests

Playwright tests exercise the built Chromium extension in an installed-extension environment, including application navigation and service configuration workflows.

Build the Chromium extension before running E2E tests:

```bash
npm run build:chrome
npm run test:e2e
```

**Browser coverage:** Installed-extension E2E tests currently run against Chromium. Firefox has a dedicated production build, but automated E2E testing of the installed Firefox extension is not yet supported by the project's test setup.

A successful Chromium E2E run should not be interpreted as verified Firefox extension compatibility. Firefox-specific behavior still requires manual testing.

### Code quality

Run linting and formatting checks:

```bash
npm run lint
npm run format:check
```

Run the full project verification workflow:

```bash
npm run check
```

The verification workflow checks linting, formatting, automated tests, and production builds. See [Contributing](CONTRIBUTING.md) for development and pull-request guidelines.

## Development commands

| Command                   | Description                              |
| ------------------------- | ---------------------------------------- |
| `npm run start`           | Start the development server             |
| `npm run lint`            | Check code with ESLint                   |
| `npm run lint:fix`        | Automatically fix supported lint issues  |
| `npm run format`          | Format source files                      |
| `npm run format:check`    | Check formatting without modifying files |
| `npm run test`            | Run unit and component tests             |
| `npm run test:watch`      | Run tests in watch mode                  |
| `npm run test:e2e`        | Run Playwright E2E tests                 |
| `npm run build`           | Build both browser targets               |
| `npm run build:chrome`    | Build the Chromium extension             |
| `npm run build:firefox`   | Build the Firefox extension              |
| `npm run storybook`       | Start Storybook                          |
| `npm run build-storybook` | Build static Storybook documentation     |
| `npm run check`           | Run the project verification workflow    |

Run `npm run check` before submitting a pull request.

## Development releases

MediaManagarr provides browser-specific ZIP archives through [GitHub Releases](https://github.com/yansudeansu/mediamanagarr/releases).

Available archives follow this naming convention:

```text
mediamanagarr-vX.Y.Z-firefox.zip
mediamanagarr-vX.Y.Z-chrome.zip
```

These archives are intended for development and testing, not browser-store distribution.

See the [User Guide](docs/USER-GUIDE.md#installation) for installation instructions.

## Contributing

Contributions, bug reports, and suggestions are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development conventions and pull-request guidelines.

## Security and privacy

Never include real API keys, passwords, private server addresses, or personal media data in issues, tests, screenshots, or Storybook stories.

## License

Licensed under the [MIT License](LICENSE).
