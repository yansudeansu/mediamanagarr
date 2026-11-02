# MediaManagarr Architecture

This document introduces MediaManagarr's application structure and explains how service definitions, capabilities, navigation features, and reusable UI components fit together.

It describes the current architecture and its development principles, not a proposed plugin framework.

## Overview

MediaManagarr is a Vue 3 and TypeScript browser extension built with Vite.

The application brings multiple self-hosted media services into shared views. Rather than giving every integration a separate navigation tab, it uses service capabilities to determine which features are available.

The main responsibilities are divided between:

- **Service registry:** Describes supported integrations and their capabilities.
- **Navigation features:** Defines application views and their capability requirements.
- **Background services:** Handle external service communication.
- **Views:** Coordinate feature-specific data and user workflows.
- **Components:** Provide reusable interface elements.
- **Application state:** Coordinates navigation and workspace behavior.

## Service registry

The service registry is defined in `src/services/registry.ts`.

`SERVICE_REGISTRY` is the central definition of supported integrations. Each service includes an identifier, display name, description, category, icon, capabilities, and configuration requirements.

The current integrations are:

| Service     | Capability  | Feature   |
| ----------- | ----------- | --------- |
| Jellyfin    | `up-next`   | Up Next   |
| Seerr       | `requests`  | Requests  |
| Sonarr      | `calendar`  | Calendar  |
| Radarr      | `calendar`  | Calendar  |
| qBittorrent | `downloads` | Downloads |

All currently registered services require a server URL and an API key.

The registry also provides helpers for validating service identifiers, checking capabilities, determining whether required configuration fields are present, and collecting configured services.

A service being _configured_ means its required fields are populated. It does not, by itself, guarantee that the server is reachable or that authentication succeeds.

## Navigation features

Navigation features are defined in `src/navigation/features.ts`.

Each feature has an identifier, display label, and required capability.

The current features are:

- **Requests:** Requires `requests`.
- **Up Next:** Requires `up-next`.
- **Calendar:** Requires `calendar`.
- **Downloads:** Requires `downloads`.

`getAvailableNavigationItems()` checks the configured-service state and includes a feature when at least one configured service provides its required capability.

This allows multiple integrations to contribute to the same application feature.

For example, Sonarr and Radarr both provide the `calendar` capability, so they can contribute to the Calendar view without requiring separate navigation tabs.

Navigation availability is based on configuration and declared capabilities, not a live connection-health check.

## Application structure

The source code is organized around the responsibilities of the extension.

| Location          | Responsibility                                                      |
| ----------------- | ------------------------------------------------------------------- |
| `src/background/` | Extension background behavior, messaging, and service communication |
| `src/components/` | Reusable UI components                                              |
| `src/navigation/` | Navigation features and capability requirements                     |
| `src/services/`   | Service definitions and registry helpers                            |
| `src/types/`      | Shared TypeScript types                                             |
| `src/utils/`      | Shared utilities, configuration, storage, and workspace state       |
| `src/views/`      | Application screens and feature workflows                           |
| `src/App.vue`     | Application-level coordination                                      |
| `src/main.ts`     | Application entry point                                             |

These responsibilities are guidelines for maintaining the existing architecture, not a requirement to create new abstractions for every feature.

## Components and views

MediaManagarr uses reusable Vue components, organized with Atomic Design conventions where appropriate.

Components should primarily handle presentation and local interface interactions through props, events, and slots.

Views coordinate the data, state, and workflows needed by a feature.

As a general rule:

- Keep reusable components independent of specific external services.
- Keep network requests and browser APIs outside presentation components.
- Put feature-specific coordination in the relevant view.
- Share behavior through utilities or composables when there is a demonstrated need.
- Avoid moving application-specific logic into the component library.

The component library is developed and documented with [Storybook](https://yansudeansu.github.io/mediamanagarr/).

## Adding or changing an integration

When working on a service integration:

1. Review the existing service definitions and shared types.
2. Identify the capabilities the integration provides.
3. Add or update the service definition in the registry.
4. Implement the required API communication in the appropriate background service.
5. Connect the integration to existing feature workflows where applicable.
6. Update configuration handling and relevant UI.
7. Add or update tests and documentation.

A new service does not necessarily need a new navigation view. Prefer contributing to an existing feature when its capabilities match.

If an integration requires functionality that does not fit an existing capability, evaluate whether a new capability and navigation feature are appropriate.

Do not introduce a general-purpose provider abstraction or plugin system without a concrete requirement.

## Browser extension considerations

MediaManagarr supports separate Firefox and Chromium builds.

Extension-specific behavior includes browser permissions, background messaging, persistence, and workspace management.

The application supports toolbar popup, native sidebar, and detached window workflows, subject to browser capabilities.

Changes affecting workspace behavior should preserve existing settings and navigation state wherever possible.

See the [User Guide](USER-GUIDE.md) for browser-specific behavior and installation instructions.

## Testing

Use the existing testing tools according to the change being made:

- **Vitest:** Unit and component tests.
- **Storybook:** Component development and accessibility checks.
- **Playwright:** Installed Chromium extension E2E tests.
- **Manual verification:** Browser-specific behavior that is not covered by automation, particularly Firefox extension behavior.

See [Contributing](../CONTRIBUTING.md) for development commands and pull-request expectations.

## Architectural principles

MediaManagarr favors incremental improvements over speculative infrastructure.

When extending the project:

- Preserve existing service configurations and storage formats.
- Prefer capability-driven features over service-specific navigation.
- Keep service definitions, networking, navigation, and presentation separate.
- Reuse working components and functionality.
- Introduce abstractions when actual requirements justify them.
- Avoid unrelated rewrites during feature development.

For planned improvements, see the [Development Roadmap](ROADMAP.md).
