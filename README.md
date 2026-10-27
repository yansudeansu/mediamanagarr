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

Run `npm run check` before submitting a pull request. It verifies linting, formatting, tests, and production builds.

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
