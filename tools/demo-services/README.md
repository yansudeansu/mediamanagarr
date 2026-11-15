# MediaManagarr local demo services

A standalone API simulator for manually testing the installed MediaManagarr extension with synthetic data in Firefox or Chromium. It can also support browser-store review.

The simulator runs separately from the extension. It requires no Playwright, Docker, extension changes, or real service credentials. It simulates selected endpoints; it does not run the actual Jellyfin, Seerr, Sonarr, Radarr, or qBittorrent applications or establish compatibility with their real installations.

## Start

Use Node.js 24 or newer. From the repository root:

```bash
npm run demo:services
```

The corresponding package.json script is:

```json
"demo:services": "node tools/demo-services/demo-services.mjs"
```

Alternatively, from this directory:

```bash
node demo-services.mjs
```

Keep the terminal running. In the installed extension's Settings, configure these services and grant the requested localhost permissions:

| Service     | URL                    |
| ----------- | ---------------------- |
| Jellyfin    | http://127.0.0.1:18961 |
| Seerr       | http://127.0.0.1:18962 |
| Sonarr      | http://127.0.0.1:18963 |
| Radarr      | http://127.0.0.1:18964 |
| qBittorrent | http://127.0.0.1:18965 |

Use `demo-api-key` for every service. Select `Demo User` for Jellyfin.

Use a separate test browser profile to avoid changing real service configurations. The simulator listens only on IPv4 loopback, so run it on the same computer as the browser. It does not expose a public demo server. All five listed ports must be available.

If upgrading from reviewer-services.mjs, replace the previous API key with `demo-api-key` in each service configuration, reconnect, and select `Demo User` again in Jellyfin. URLs and ports are unchanged.

## Test the extension

1. Test each connection. Entering an incorrect API key should produce an authentication error.
2. Open Requests. Check All, Pending, Approved, pagination, and Refresh.
3. Open Up Next. Check the sample movies and episodes and pagination. Notification badges and New filters depend on stored scan state and are not fully verified by these steps.
4. Open Calendar in the current month. Check TV and Movies filters, select marked dates, and refresh. Dates are generated relative to server startup. Adjacent months may be empty.
5. Open Downloads. Stop the first torrent, refresh, start it again, and remove a simulated torrent. Only in-memory records change; no media, files, trackers, or peers are involved.
6. Open popup, sidebar, and detached workspaces to test the extension's normal browser integration.
7. Stop the simulator with Ctrl+C and refresh a service to check offline handling. Restart it and refresh again to check recovery.

Restarting resets the simulator's in-memory data. It does not clear the extension's stored configuration or notification state.

## Supported requests

- Jellyfin: connection check, user list, paginated arrivals, and missing-image responses.
- Seerr: connection check, filtered and paginated requests, and title metadata.
- Sonarr and Radarr: connection checks, date-filtered calendars, and series or movie metadata with empty image lists.
- qBittorrent: connection check, transfer statistics, torrent list, and simulated start, stop, and delete actions.

Unknown routes return 404 and are logged as `Unhandled simulator route`. Credentials and query values are not included in that log message. Investigate unexpected routes before considering a test flow fully covered.

## Limitations

- Posters are omitted. Jellyfin image requests return 404; Seerr and calendar metadata contain no poster paths. The supplied sample data therefore does not trigger third-party poster requests.
- Playback and real service dashboards are not provided. Quick-access links point to API-only servers and do not demonstrate working service dashboards.
- Torrent progress is static. Start and stop change state and transfer statistics; delete removes only an in-memory record. The `deleteFiles` parameter never deletes files.
- Jellyfin automatic notification scanning has not been checked against the notification implementation. Notification behavior requires further verification.
- The simulator implements the authentication headers used by MediaManagarr. This does not validate the authentication behavior of real service versions or reverse proxies.
