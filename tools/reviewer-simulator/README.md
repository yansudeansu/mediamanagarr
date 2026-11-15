# MediaManagarr local reviewer API simulator

This is a standalone simulator, not Jellyfin, Seerr, Sonarr, Radarr, or qBittorrent. It exercises the installed extension's ordinary HTTP request paths using synthetic data. It requires no Playwright, Docker, extension changes, or real credentials. It does not establish compatibility with real service installations or guarantee store approval.

## Start

Use Node.js 24 or newer. From this directory:

```bash
node reviewer-services.mjs
```

Keep the terminal running. In the installed extension's Settings, add the following services and grant the requested local host permissions:

| Service | URL |
| --- | --- |
| Jellyfin | http://127.0.0.1:18961 |
| Seerr | http://127.0.0.1:18962 |
| Sonarr | http://127.0.0.1:18963 |
| Radarr | http://127.0.0.1:18964 |
| qBittorrent | http://127.0.0.1:18965 |

Use `review-only-api-key` as the API key for every service. Select `Review User` for Jellyfin.

Use a separate test browser profile to avoid changing existing service configurations. This simulator listens only on IPv4 loopback and does not require a public server. Run it on the same computer as the browser. Ports must be available.

## Exercise the extension

1. Test each connection. An incorrect API key should produce an authentication error.
2. Open Requests. Check All, Pending, Approved, pagination, and Refresh.
3. Open Up Next. Check the sample movies and episodes and pagination. Notification badges and New filters depend on the extension's stored scan state and need additional validation.
4. Open Calendar in the current month. Check TV/Movies filters and select a marked date. Dates are generated relative to server startup.
5. Open Downloads. Stop the first torrent, refresh, start it again, and remove a simulated torrent. These operations affect only in-memory records. No files, downloads, trackers, or peers are involved.
6. Open popup, sidebar, and detached workspaces. These use the extension's normal browser APIs.
7. Stop the simulator with Ctrl+C and refresh a service to exercise offline handling. Restart to reset the simulated data.

## Deliberate limitations

- No posters are provided. Jellyfin image requests return 404; Seerr and calendar items have no poster paths. This avoids external image requests from the simulator's sample data.
- No media playback or real service web dashboards are provided. Quick-access links target these API-only servers and are not working dashboard demonstrations.
- Only the endpoints supplied during implementation are covered. In particular, Jellyfin notification scanning has not been checked against `jellyfin-notifications.ts`.
- Torrent progress is static. Start/stop/delete state changes are simulated in memory, and `deleteFiles` never deletes local files.
- Unknown routes return 404 and are logged without credentials or query values. Report these routes when testing so missing endpoints can be assessed.

## Verification status

Node syntax validation and HTTP smoke tests passed for authentication rejection, Jellyfin users/arrivals pagination, Seerr filters/metadata, both calendars, and torrent start/stop/delete.

The simulator has not yet been tested end to end through the installed Firefox extension. Complete that test before presenting it as a verified reviewer setup. Mozilla may request access to real services in addition to this simulator.
