# MediaManagarr Roadmap

MediaManagarr is a browser extension for Jellyfin, Seerr, Sonarr, Radarr, and qBittorrent.

This roadmap tracks upcoming work, not completed features. Milestones are goals, not release dates.

## Current priorities

### Milestone 2.5 — Release automation

- Verify GitHub Release publishing with a real release.
- Test recovery after interrupted publishing.
- Validate release ZIPs and browser compatibility.

### Milestone 3 — Settings

- Complete manual verification in Firefox, Zen Browser, and Chrome.
- Review keyboard navigation and accessibility.
- Merge the Settings feature branch.

## Upcoming milestones

### 4 — Requests (Seerr)

- Display requests with media details and statuses.
- Add filtering, pagination, and loading/error states.
- Test API responses and user interactions.

### 5 — Up Next (Jellyfin)

- Display recently added and unwatched media.
- Use the Jellyfin user selected in Settings.
- Add filtering, pagination, and notifications.
- Handle missing artwork and connection failures.

### 6 — Calendar (Sonarr & Radarr)

- Display upcoming episodes and movies.
- Add month navigation, filtering, and release details.
- Combine data from both services.
- Support keyboard navigation.

### 7 — Downloads (qBittorrent)

- Display torrents, progress, speeds, and ETA.
- Support start, stop, and removal actions.
- Require confirmation for destructive operations.
- Never delete downloaded files without explicit permission.

### 8 — Testing & Accessibility

- Add browser automation for critical workflows.
- Test extension permissions, storage, and background messaging.
- Expand cross-browser testing.
- Audit keyboard navigation and WCAG 2.2 AA accessibility.

### 9 — Service Health & Reliability

- Monitor configured services.
- Show clear connection and authentication errors.
- Add recovery indicators.
- Improve retries, timeouts, and request handling.

### 10 — Feature Enhancements

Potential improvements based on feedback:

- Better filtering, sorting, and media details.
- More notification options.
- Improved download management.
- Cross-service activity and related media.

### 11 — Branding & Documentation

- Refine extension branding and artwork.
- Improve installation and configuration guides.
- Document troubleshooting and contribution workflows.

### 12 — Release & Distribution

- Validate Firefox and Chromium extension packages.
- Test installation and updates.
- Prepare Firefox Add-ons and Chrome Web Store submissions.
- Document release and distribution procedures.

## Future possibilities

- Standalone web application.
- Additional service integrations.
- Customizable dashboards.
- Richer cross-service features.

---

Milestones are complete when functionality is tested, documented, accessible, and verified in supported browsers.
