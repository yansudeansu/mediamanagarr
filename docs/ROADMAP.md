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

## 1. Scrollable Navigation

**Priority: High**

Improve navigation usability when the available tabs exceed the width of a compact workspace.

- Support horizontal scrolling when navigation tabs exceed available space.
- Show left/right arrows only when needed.
- Automatically scroll the active tab into view.
- Support mouse, trackpad, touch, and keyboard navigation.
- Keep the design consistent across popup, sidebar, and detached window.
- Consider subtle edge fades or other visual overflow indicators.
- Prevent navigation labels from being unintentionally clipped or becoming inaccessible.
- Avoid unnecessary controls when all navigation items fit.
- Preserve the existing behavior of hiding navigation when only one view is available.

## 2. Direct Media Links

**Priority: High**

Make it easier to jump directly from MediaManagarr to available media.

Unlike Quick Access shortcuts, direct media links should open a specific item rather than a service homepage.

- Add direct links from MediaManagarr to media in Jellyfin.
- **Up Next:** Open the specific episode directly in Jellyfin.
- **Requests:** Link to the requested movie or show when available in Jellyfin.
- **Calendar:** Link to episodes already available in the media library.
- Use the user's configured server URL and the correct media item ID.
- Hide playback links when media is unavailable or cannot be reliably matched.
- Open links in a new browser tab without closing the extension.
- Design the feature to support future providers such as Plex and Emby.

Keep direct media links separate from the global Quick Access menu.

## 3. Component Cleanup & Responsibility Boundaries

**Priority: Medium / Incremental**

Review the existing Vue components and simplify their responsibilities.

The goal is to make reusable components primarily presentational and data-driven, while keeping feature behavior in views and application-level coordination in App.

This is an incremental cleanup effort, not a requirement to rewrite the component library.

### Reusable Components

- Review atoms, molecules, organisms, and templates for unnecessary application-specific logic.
- Prefer components that receive data through props and slots.
- Communicate user interactions through clearly defined events.
- Keep components independent of service configuration, background messaging, and browser storage wherever practical.
- Avoid components directly opening workspaces, navigating application views, or communicating with external services.
- Keep local UI behavior inside components when appropriate, such as dropdown visibility, keyboard interaction, focus management, and presentation state.
- Avoid moving every small interaction into a view when doing so would make components harder to reuse.
- Remove obsolete props, events, controls, and component-specific workarounds.
- Consolidate duplicated presentation logic and CSS where it provides a clear benefit.
- Prefer existing shared components over introducing near-duplicates.
- Keep component APIs small, predictable, and appropriately typed.

### Views & Application Logic

- Let views own feature-specific state, data loading, and user workflows.
- Let views coordinate reusable components and translate their events into feature actions.
- Keep App responsible for application-level navigation, Settings visibility, workspace transitions, and shared application state.
- Avoid moving feature-specific implementation details into App.
- Keep persistence, browser-specific operations, and external API communication in shared utilities or background services.
- Extract composables when behavior is genuinely shared or a view becomes difficult to maintain.
- Avoid introducing composables solely to make components appear smaller.
- Prefer clear ownership over rigid rules about file size or component complexity.

### Component Testing

- Focus component tests on observable behavior, rendered output, accessibility, props, and emitted events.
- Avoid coupling parent component tests to the implementation details of their children.
- Introduce reusable selector objects to make component tests easier to read and maintain.
- Prefer stable, meaningful selectors over fragile DOM structure assumptions.
- Keep tests independent of unrelated child component implementations where practical.
- Preserve existing useful coverage while improving test structure incrementally.
- Avoid rewriting working tests solely to adopt a new testing convention.
- Continue using Storybook to document component states and interactions.

### Cleanup Boundaries

- Review components as related features are updated rather than migrating everything at once.
- Keep cleanup pull requests focused and independently reviewable.
- Preserve existing behavior, accessibility, and visual consistency.
- Avoid unnecessary component splitting, wrapper components, and speculative abstractions.
- Do not introduce a new state management library without a demonstrated need.
- Treat simple, understandable code as the preferred outcome.

The intended result is a component library that is easy to reuse, views that clearly own feature behavior, and an App component that coordinates the application without becoming responsible for every feature.

## 4. Testing & Accessibility

**Priority: Ongoing / Pre-release**

Build on the existing Vitest and Storybook coverage with browser-level testing and automated accessibility checks.

### Browser Automation

- Keep Vitest as the primary unit and component testing framework.
- Evaluate Playwright for end-to-end browser automation.
- Test critical extension workflows in real browsers.
- Verify extension permissions, storage, and background messaging.
- Expand cross-browser testing for Firefox, Zen Browser, and Chrome.
- Test popup, native sidebar, and detached window behavior.
- Verify toolbar-button behavior for each supported default workspace mode.
- Test workspace preference persistence and manual workspace switching.
- Verify navigation state restoration when switching workspaces.
- Verify detached window reuse and behavior when a workspace is already open.
- Document browser-specific workspace limitations discovered during testing.
- Integrate suitable automated checks into CI.

### Accessibility

- Build on existing accessibility tests and component practices.
- Introduce automated accessibility checks where practical.
- Audit keyboard navigation and focus management.
- Review screen reader support and accessible status messages.
- Verify Quick Access menu accessibility, including keyboard interaction and focus restoration.
- Audit WCAG 2.2 AA accessibility.
- Manually verify behavior that automated tools cannot fully assess.
- Fix issues identified during testing.

Testing and accessibility remain ongoing requirements throughout every milestone.

## 5. Extensible Integrations

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

## 6. Branding & Documentation

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

## 7. Release & Distribution

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

## 8. Future Possibilities

Ideas that may be explored after the initial release or when there is sufficient demand.

- **Additional integrations:** Plex, Emby, Transmission, Lidarr, Readarr, Bazarr, and others.
- **Navigation customization:** Allow users to reorder or hide tabs.
- **Multiple instances:** Support multiple configurations of the same service.
- **Service management:** Let users enable or disable integrations.
- **Additional views:** Music, Books, Subtitles, Activity, or other service-specific features.
- **Unified calendar:** Combine upcoming releases from different supported media types.
- **Media provider links:** Extend direct playback links beyond Jellyfin.
- **Advanced filtering:** More filtering and sorting options.
- **Expanded media details:** Display additional information where useful.
- **Notifications:** More notification options and customization.
- **Download management:** Additional controls and information.
- **Cross-service activity:** Connect related media and service activity.
- **Customizable dashboards:** Allow users to personalize their workspace.
- **Standalone web application:** Explore a browser-independent version.

Future features will be prioritized based on user feedback and practical value rather than speculative requirements.

## Implementation Plan

### Phase 1 — Scrollable Navigation

- Implement horizontal navigation scrolling.
- Add conditional overflow controls.
- Ensure active tabs remain visible.
- Verify keyboard, mouse, touch, and trackpad behavior.
- Preserve the existing single-view behavior.

**Suggested PR:** `feat/scrollable-navigation`

### Phase 2 — Direct Media Links

- Add direct Jellyfin links to Up Next, Requests, and Calendar.
- Verify media matching and link generation.
- Prepare the implementation for additional media providers.

### Phase 3 — Component Cleanup

- Review reusable components for unnecessary feature-specific logic.
- Clarify ownership between components, views, App, utilities, and background services.
- Remove obsolete component APIs and duplicated presentation logic.
- Introduce selector objects for component tests.
- Preserve behavior and existing useful test coverage.

**Suggested PR:** `refactor/component-cleanup`

Component cleanup may also be performed incrementally alongside earlier phases when directly relevant.

### Phase 4 — Testing & Accessibility

- Expand existing tests to cover new functionality.
- Introduce browser-level end-to-end testing.
- Add automated accessibility checks.
- Complete cross-browser and manual accessibility audits.
- Verify workspace behavior in supported browsers.

### Phase 5 — Extensibility & Documentation

- Introduce shared provider interfaces where needed.
- Document how to add integrations and navigation features.
- Refine branding, configuration guides, and troubleshooting documentation.

### Phase 6 — Release & Distribution

- Validate release automation and extension packages.
- Complete installation and upgrade testing.
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

1. `feat: add horizontally scrollable navigation`
2. `feat: add direct Jellyfin media links`
3. `refactor: simplify component responsibilities and remove obsolete APIs`
4. `test: introduce reusable component selector objects`
5. `test: introduce browser-level end-to-end testing`
6. `test: expand automated accessibility checks`
7. `refactor: introduce extensible provider interfaces`
8. `docs: improve integration and contributor documentation`
9. `chore: prepare browser store releases`

---

Milestones are complete when functionality is tested, documented, accessible, and verified in supported browsers.
