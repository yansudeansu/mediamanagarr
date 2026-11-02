# Contributing to MediaManagarr

Thanks for your interest in MediaManagarr! The project is in early development, so focused suggestions, issues, and pull requests are especially helpful.

## Before you start

Read the [README](README.md), [User Guide](docs/USER-GUIDE.md), and [development roadmap](docs/ROADMAP.md).

For substantial changes or new integrations, consider opening an issue to discuss the approach before implementing it.

## Local setup

Use **npm** and a Node.js version compatible with the project's `package.json`.

```bash
git clone https://github.com/yansudeansu/mediamanagarr.git
cd mediamanagarr
npm ci
npm run start
```

The development server runs the Vue application. To test browser-extension functionality, build and load the extension using the [installation instructions](docs/USER-GUIDE.md#installation).

## Quality checks

Run the full verification workflow before submitting a pull request:

```bash
npm run check
```

This checks linting, formatting, unit and component tests, and production builds for Firefox and Chromium.

To run checks individually:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

Use `npm run format` to apply the repository's formatting rules.

### End-to-end testing

MediaManagarr uses Playwright to test the installed Chromium extension.

```bash
npm run build:chrome
npm run test:e2e:chromium
```

Firefox has a separate production build, but the current Playwright setup does not automate the installed Firefox extension. Firefox-specific extension behavior requires manual verification.

### Component development

Reusable UI components are documented in Storybook.

```bash
npm run storybook
```

The component library includes accessibility tooling to help identify issues during development.

## Coding conventions

- Use Vue 3 and TypeScript, following existing project patterns.
- Prefer small, focused changes and avoid unnecessary dependencies.
- Keep service networking and browser APIs out of presentation components.
- Use the existing Atomic Design directories (`atoms`, `molecules`, `organisms`, `templates`) where appropriate; keep complete screens in `src/views/`.
- Keep service definitions separate from navigation features and background API communication.
- Prefer props, events, and slots for reusable components.
- Add or update tests for behavior changes, including error states and keyboard interaction where relevant.
- Maintain Storybook stories for reusable components when appropriate.
- Use npm exclusively and commit `package-lock.json` when dependencies change.
- Never commit credentials, tokens, or private server configuration. Use mock data for tests and stories.

## Pull requests

1. Create a focused branch from `master`.
2. Make a small, reviewable change.
3. Add tests and documentation where relevant.
4. Run the appropriate quality checks.
5. Explain what changed and how it was tested in the pull request.

Pull requests targeting `master` are checked by GitHub Actions, including automated Chromium extension E2E tests.

## Security issues

Please do not publish sensitive vulnerability details or credentials in public issues.

Until a dedicated security reporting process is documented, contact the repository maintainer privately through an appropriate channel.

## Community expectations

Be respectful and constructive. Discuss technical disagreements on their merits and assume good intent.

## License

By contributing, you agree that your contributions will be distributed under the project's [MIT License](LICENSE).
