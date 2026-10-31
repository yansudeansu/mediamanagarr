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

    src/
    ├── background/
    │   ├── services/        # External APIs and service-specific operations
    │   ├── index.ts
    │   └── messages.ts
    ├── components/          # Reusable UI components
    ├── composables/         # Shared Vue behavior, when needed
    ├── navigation/          # Navigation features and capability requirements
    ├── services/            # Service registry and integration definitions
    ├── types/               # Shared TypeScript types
    ├── utils/               # Configuration, storage, and shared utilities
    ├── views/               # Application views
    ├── App.vue
    └── main.ts

This is a target structure, not a required migration. New directories and abstractions should only be introduced when they serve an actual purpose.

### Architectural Principles

- **Single source of truth:** Centralize service definitions, capabilities, and navigation features.
- **Clear responsibilities:** Separate service metadata, API communication, configuration, navigation, and UI logic.
- **Capability-driven:** Allow compatible integrations to contribute to existing features rather than requiring service-specific views.
- **Provider-independent:** Design shared features to support alternatives such as Plex, Emby, and Transmission.
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
- Include appropriate tests and documentation alongside new functionality.
- Keep behavior consistent across popup, sidebar, and detached window workspaces.
- Prefer consolidating related controls over adding more buttons to an already compact interface.
- Keep major features in separate, focused pull requests.

## 1. Workspace Preferences & Header Simplification

**Priority: High**

Allow users to choose how MediaManagarr opens while simplifying the application header.

### Workspace Preferences

Allow users to choose how MediaManagarr opens when they click its browser toolbar button.

Supported workspace modes:

- **Popup:** Open MediaManagarr as a browser extension popup.
- **Sidebar:** Open MediaManagarr in the browser's native sidebar where supported.
- **Detached window:** Open MediaManagarr in a separate window.

Implementation goals:

- Add a **Default workspace mode** preference in Settings.
- Persist the selected mode across browser sessions.
- Use the preference to determine toolbar-button behavior where supported.
- Preserve the existing popup, sidebar, and detached workspace implementations.
- Move manual workspace controls into Settings.
- Allow users to open a different workspace mode without permanently changing their preference.
- Provide appropriate actions for opening or closing the sidebar and opening a detached window.
- Preserve navigation state when switching workspaces where practical.
- Handle unsupported workspace modes gracefully.
- Avoid unexpectedly opening duplicate workspaces.
- Document browser-specific behavior and limitations.

**Technical investigation required:** Browser extension toolbar-click behavior differs depending on whether an action popup is configured. Investigate the relevant Manifest V3 APIs and supported browser behavior before finalizing the implementation.

Do not assume identical toolbar behavior across Firefox, Zen Browser, and Chrome without verification.

### Minimal Application Header

Complete the header simplification after workspace preferences are implemented.

- Keep MediaManagarr branding visible.
- Retain the unified Quick Access menu for service shortcuts and Settings.
- Move Sidebar and Detach controls out of the header once replacement controls are available in Settings.
- Avoid introducing additional permanent header buttons.
- Preserve appropriate navigation back from Settings.
- Ensure the header remains usable at narrow popup widths.
- Keep the menu consistent across popup, sidebar, and detached window workspaces.

The intended result is a minimal header rather than an expanding toolbar.

### Implementation Boundaries

- Implement and verify workspace preferences before removing existing Sidebar and Detach buttons.
- Preserve a usable way to access Settings and switch workspace modes throughout the transition.
- Keep the existing Quick Access menu and configured service shortcuts intact.
- Avoid redesigning individual content views as part of this work.

## 2. Dynamic & Scrollable Navigation

**Priority: High**

Prepare navigation for additional integrations and features while improving usability in narrow workspaces.

### Dynamic Navigation

- Define navigation views through a central feature registry.
- Show or hide views based on available service capabilities.
- Allow future integrations to introduce additional views.
- Avoid hardcoded navigation items in components.
- Gracefully handle saved navigation states when a view becomes unavailable.
- Provide a helpful setup experience when no services are configured.
- Allow compatible services to contribute to existing views.
- Keep navigation independent of service connection health.
- Preserve existing navigation behavior wherever possible.

### Scrollable Navigation

- Support horizontal scrolling when navigation tabs exceed available space.
- Show left/right arrows only when needed.
- Automatically scroll the active tab into view.
- Support mouse, trackpad, touch, and keyboard navigation.
- Keep the design consistent across popup, sidebar, and detached window.
- Consider subtle edge fades or other visual overflow indicators.
- Prevent navigation labels from being unintentionally clipped or becoming inaccessible.
- Avoid unnecessary controls when all navigation items fit.

Dynamic navigation and scrollable navigation should be implemented in separate pull requests.

## 3. Direct Media Links

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
- Separate service definitions from navigation features.
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

### Phase 1 — Workspace Preferences & Header Simplification

- Investigate toolbar-click and workspace-opening APIs across supported browsers.
- Add a persistent default workspace mode preference.
- Support Popup, Sidebar, and Detached opening modes where available.
- Move manual workspace controls into Settings.
- Remove redundant Sidebar and Detach buttons from the header.
- Finalize the minimal header design.
- Test workspace transitions, persistence, and browser compatibility.

**Suggested PR:** `feat/workspace-preferences`

### Phase 2 — Dynamic Navigation

- Introduce a central navigation feature registry.
- Show navigation views based on configured service capabilities.
- Handle unavailable views and persisted navigation state.
- Provide an appropriate experience when no services are configured.

**Suggested PR:** `feat/dynamic-navigation`

### Phase 3 — Scrollable Navigation

- Implement horizontal navigation scrolling.
- Add conditional overflow controls.
- Ensure active tabs remain visible.
- Verify keyboard, mouse, touch, and trackpad behavior.

**Suggested PR:** `feat/scrollable-navigation`

### Phase 4 — Direct Media Links

- Add direct Jellyfin links to Up Next, Requests, and Calendar.
- Verify media matching and link generation.
- Prepare the implementation for additional media providers.

### Phase 5 — Testing & Accessibility

- Expand existing tests to cover new functionality.
- Introduce browser-level end-to-end testing.
- Add automated accessibility checks.
- Complete cross-browser and manual accessibility audits.

### Phase 6 — Extensibility & Documentation

- Introduce shared provider interfaces where needed.
- Document how to add integrations and navigation features.
- Refine branding, configuration guides, and troubleshooting documentation.

### Phase 7 — Release & Distribution

- Validate release automation and extension packages.
- Complete installation and upgrade testing.
- Prepare browser store submissions.
- Publish the initial release.

## Design Principles

- **Scalable:** New services and views should not require UI redesigns.
- **Configuration-aware:** Only show features users can actually use.
- **Reusable:** Centralize common integration and navigation logic.
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

1. `feat: add workspace opening preferences and simplify header`
2. `feat: add capability-driven dynamic navigation`
3. `feat: add horizontally scrollable navigation`
4. `feat: add direct Jellyfin media links`
5. `test: introduce browser-level end-to-end testing`
6. `test: expand automated accessibility checks`
7. `refactor: introduce extensible provider interfaces`
8. `docs: improve integration and contributor documentation`
9. `chore: prepare browser store releases`

---

Milestones are complete when functionality is tested, documented, accessible, and verified in supported browsers.
