# Contributing to MediaManagarr

Thanks for your interest in MediaManagarr! The project is in early development, so focused suggestions, issues, and pull requests are especially helpful.

## Before you start

Read the [README](README.md) and [development roadmap](docs/ROADMAP.md). For substantial changes or new integrations, consider opening an issue to discuss the approach before implementing it.

## Local setup

Use **npm** and a Node.js version compatible with the project's `package.json`.

```bash
# Replace YOUR_USERNAME with the repository owner.
git clone https://github.com/YOUR_USERNAME/mediamanagarr.git
cd mediamanagarr
npm ci
npm run dev
```

## Quality checks

Run these before submitting a pull request:

```bash
npm run lint
npm run format:check
npm run test
npm run build
```

Use `npm run format` to apply the repository's formatting rules.

## Coding conventions

- Use Vue 3 and TypeScript, following existing patterns.
- Prefer small, focused components and avoid unnecessary dependencies.
- Keep service networking and browser APIs out of presentation components.
- Use the Atomic Design component directories (`atoms`, `molecules`, `organisms`, `templates`) when appropriate; keep complete screens in `src/views/`.
- Add or update tests for behavior changes, including error states and keyboard interaction where relevant.
- Document reusable components in Storybook once it is available.
- Use npm exclusively and commit `package-lock.json` when dependencies change.
- Never commit credentials, tokens, or private server configuration. Use mock data for tests and stories.

## Pull requests

1. Create a focused branch from `master`.
2. Make a small, reviewable change.
3. Add tests and documentation where relevant.
4. Run the quality checks above.
5. Explain what changed and how it was tested in the pull request.

## Security issues

Please do not publish sensitive vulnerability details or credentials in public issues. Until a dedicated security reporting process is documented, contact the repository maintainer privately through an appropriate channel.

## Community expectations

Be respectful and constructive. Discuss technical disagreements on their merits and assume good intent.

## License

By contributing, you agree that your contributions will be distributed under the project's [MIT License](LICENSE).
