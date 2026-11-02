# MediaManagarr Roadmap

MediaManagarr is a browser extension for Jellyfin, Seerr, Sonarr, Radarr, and qBittorrent.

This roadmap tracks upcoming work, not completed features. Milestones are goals, not release dates.

## Goal

Improve MediaManagarr's reliability, usability, and extensibility while preparing it for a wider release.

Build on the existing test coverage and architecture without limiting the extension to its current services or navigation views.

Development should also simplify the codebase, improve contributor experience, and establish a clear foundation for future integrations.

The interface should remain compact and focused, providing convenient access to connected services without adding unnecessary controls to individual views.

## Architecture & Development Direction

MediaManagarr should evolve toward a maintainable, capability-driven architecture where integrations, application features, and UI components have clear responsibilities.

The goal is to make adding services and features straightforward without introducing unnecessary abstractions or rewriting working functionality.

### Target Structure

The intended project structure separates integration definitions, API communication, navigation, and UI responsibilities.

```text
src/
├── background/
│   ├── services/        # External APIs and service-specific operations
│   ├── index.ts
│   └── messages.ts
├── components/          # Reusable, primarily presentational UI components
├── composables/         # Shared Vue behavior, when needed
├── navigation/          # Navigation features and capability requirements
├── services/            # Service registry and integration definitions
├── types/               # Shared TypeScript types
├── utils/               # Configuration, storage, and shared utilities
├── views/               # Feature state and application view coordination
├── App.vue              # Application-level state and workspace transitions
└── main.ts
```

This is a target structure, not a required migration. New directories and abstractions should only be introduced when they serve an actual purpose.

### Architectural Principles

- **Single source of truth:** Centralize service definitions, capabilities, and navigation features.
- **Clear responsibilities:** Separate service metadata, API communication, configuration, navigation, and UI logic.
- **Capability-driven:** Allow compatible integrations to contribute to existing features rather than requiring service-specific views.
- **Provider-independent:** Design shared features to support alternatives such as Plex, Emby, and Transmission.
- **Presentation-focused components:** Keep reusable UI components primarily driven by props, slots, and events.
- **View-owned feature logic:** Keep feature state, data loading, and user workflows in the views that coordinate them.
- **App-owned application state:** Keep global navigation, workspace transitions, and application-level coordination in App.
- **Shared infrastructure:** Keep persistence, browser APIs, and external service communication in appropriate utilities and background services.
- **Backward-compatible:** Preserve existing configurations, storage formats, integrations, and workspace behavior.
- **Developer-friendly:** Use predictable file locations, clear naming, and straightforward TypeScript interfaces.
- **Incremental:** Introduce provider interfaces and other abstractions only when real requirements justify them.
- **Continuously simplified:** Reduce duplication and unnecessary complexity as part of relevant feature work.

### Development Approach

Each pull request should contribute toward the target architecture while remaining focused and reviewable.

- Reuse and improve existing functionality before introducing replacements.
- Refactor related code when it improves readability, maintainability, or testability.
- Avoid speculative infrastructure, unnecessary dependencies, and unrelated rewrites.
- Keep service definitions separate from navigation features and connection health.
- Preserve the existing Vue component structure unless a change provides a clear benefit.
- Keep reusable components independent of application-specific state and browser APIs wherever practical.
- Prefer props and events over components directly accessing application services.
- Keep feature-specific state and workflows in views rather than reusable components.
- Keep App focused on application-level coordination rather than individual feature implementations.
- Extract shared behavior into composables or utilities only when there is a demonstrated need.
- Include appropriate tests and documentation alongside new functionality.
- Keep behavior consistent across popup, sidebar, and detached window workspaces.
- Prefer consolidating related controls over adding more buttons to an already compact interface.
- Keep major features in separate, focused pull requests.

## Testing & Accessibility

Testing and accessibility are ongoing quality requirements rather than a one-time milestone.

MediaManagarr uses Vitest for unit and component tests, Storybook for component development and accessibility tooling, and Playwright for browser-level end-to-end testing.

### Automated Testing

- Maintain shared selector objects for application navigation, Settings, and critical workflows.
- Prefer accessible roles and names, using stable test IDs only when necessary.
- Reuse shared selectors across relevant component and E2E tests.
- Preserve existing unit, component, and Storybook coverage.
- Maintain installed-extension Playwright E2E tests for Chromium.
- Cover application startup, navigation, service configuration, and critical extension workflows.
- Verify permissions, storage, and background messaging where practical.
- Keep automated checks integrated into development and CI workflows where reliable.

### Browser Compatibility

Chromium installed-extension E2E testing is automated.

Firefox has a dedicated production build, but the current Playwright setup does not automate the installed Firefox extension's UI. Firefox compatibility therefore requires additional manual verification.

Future testing improvements should:

- Expand automated browser coverage when reliable tooling becomes available.
- Verify popup, native sidebar, and detached window behavior in supported browsers.
- Test workspace preference persistence and manual workspace switching.
- Verify navigation state restoration and detached window reuse.
- Check toolbar-button behavior for supported workspace modes.
- Document browser-specific limitations and regressions.
- Validate Firefox and Chromium extension packages before release.

Ordinary web-page tests should not be presented as equivalent to installed-extension testing.

### Accessibility

- Continue using Storybook accessibility tooling and existing accessibility tests.
- Expand automated accessibility checks where practical.
- Prefer semantic controls, accessible names, and keyboard-friendly interactions.
- Audit keyboard navigation, focus management, and screen reader support.
- Verify accessible status messages and error feedback.
- Check Quick Access keyboard interaction and focus restoration.
- Work toward WCAG 2.2 AA conformance.
- Manually verify accessibility behavior that automated tools cannot fully assess.
- Fix accessibility issues as they are identified.

Testing and accessibility improvements should accompany relevant feature work rather than require a separate large-scale testing initiative.

## 1. Extensible Integrations

**Priority: Medium / Incremental**

Make it easier for contributors to add new integrations without rewriting existing features.

- Design around capabilities rather than specific service names.
- Maintain the separation between service definitions and navigation features.
- Introduce shared provider interfaces where appropriate.
- Support alternatives such as Plex, Emby, or Transmission in the future.
- Prepare for additional integrations such as Lidarr, Readarr, Bazarr, and other *arr services.
- Allow integrations to contribute data to existing views where appropriate.
- Support additional navigation views when new functionality requires them.
- Ensure new configured integrations can appear in Quick Access without duplicating menu logic.
- Document how contributors can register services and features.
- Avoid building an unnecessarily complex plugin system.

Introduce provider abstractions incrementally as real integrations require them.

## 2. Branding & Documentation

**Priority: Pre-release**

Prepare MediaManagarr for a wider audience.

- Refine extension branding, icons, and artwork.
- Improve installation and configuration guides.
- Document supported services and required permissions.
- Document Quick Access and workspace preferences.
- Explain supported workspace modes and browser-specific limitations.
- Add troubleshooting documentation.
- Improve contribution and development guides.
- Document the service registry and integration architecture.
- Review screenshots and other release materials.

## 3. Release & Distribution

**Priority: Pre-release**

Prepare and publish MediaManagarr for supported browsers.

- Verify GitHub Release publishing with a real release.
- Test recovery after interrupted publishing.
- Validate release ZIPs and browser compatibility.
- Validate Firefox and Chromium extension packages.
- Test installation, updates, and upgrades.
- Verify workspace preference behavior in packaged extensions.
- Prepare Firefox Add-ons and Chrome Web Store submissions.
- Document release and distribution procedures.

## 4. Future Possibilities

Ideas that may be explored after the initial release or when there is sufficient demand.

- **Additional integrations:** Plex, Emby, Transmission, Lidarr, Readarr, Bazarr, and others.
- **Navigation customization:** Allow users to reorder or hide tabs.
- **Multiple instances:** Support multiple configurations of the same service.
- **Service management:** Let users enable or disable integrations.
- **Additional views:** Music, Books, Subtitles, Activity, or other service-specific features.
- **Unified calendar:** Combine upcoming releases from different supported media types.
- **Advanced filtering:** More filtering and sorting options.
- **Expanded media details:** Display additional information where useful.
- **Notifications:** More notification options and customization.
- **Download management:** Additional controls and information.
- **Cross-service activity:** Connect related media and service activity.
- **Customizable dashboards:** Allow users to personalize their workspace.
- **Standalone web application:** Explore a browser-independent version.

Future features will be prioritized based on user feedback and practical value rather than speculative requirements.

## Implementation Plan

### Phase 1 — Extensibility & Documentation

- Introduce shared provider interfaces where needed.
- Document how to add integrations and navigation features.
- Refine branding, configuration guides, and troubleshooting documentation.
- Maintain automated testing and accessibility practices alongside implementation work.

### Phase 2 — Release & Distribution

- Validate release automation and extension packages.
- Complete installation and upgrade testing.
- Verify supported browser behavior and accessibility.
- Prepare browser store submissions.
- Publish the initial release.

## Design Principles

- **Scalable:** New services and views should not require UI redesigns.
- **Configuration-aware:** Only show features users can actually use.
- **Reusable:** Centralize common integration and navigation logic.
- **Presentation-focused:** Keep reusable components primarily driven by props, slots, and events.
- **Clear ownership:** Components handle presentation, views coordinate features, and App coordinates application-level behavior.
- **Appropriate local state:** Keep reusable UI interactions inside components when they do not depend on application-specific behavior.
- **Accessible:** Support keyboard navigation and different screen sizes.
- **Maintainable:** Prefer simple, typed interfaces over complex abstractions.
- **Backward-compatible:** Preserve existing settings, integrations, and workspace behavior.
- **Provider-independent:** Features should work with compatible services rather than depend on specific service names.
- **Unified experience:** Prefer extending existing views over creating unnecessary duplicates.
- **Minimal interface:** Keep the header and individual views free from unnecessary controls.
- **Predictable workspace behavior:** Respect the user's preferred opening mode while retaining manual alternatives.
- **Well-tested:** Build on existing automated tests and verify new functionality across supported browsers.
- **Developer-friendly:** Keep responsibilities and file locations clear for new contributors.
- **Continuously simplified:** Reduce duplication and unnecessary complexity as part of feature development.

## Suggested GitHub Issues

1. `test: expand automated accessibility checks`
2. `test: improve Firefox installed-extension E2E coverage when supported`
3. `refactor: introduce extensible provider interfaces`
4. `docs: improve integration and contributor documentation`
5. `chore: prepare browser store releases`

---

Milestones are complete when functionality is tested, documented, accessible, and verified in supported browsers.
