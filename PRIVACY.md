# Privacy Policy

**MediaManagarr**

**Last updated:** November 15, 2026

## Overview

MediaManagarr is an open-source browser extension for managing self-hosted media services, including Jellyfin, Seerr, Sonarr, Radarr, and qBittorrent.

MediaManagarr does not operate a developer-controlled backend and does not include analytics, telemetry, advertising trackers, or automatic crash reporting.

The extension communicates directly with services you configure and, when displaying certain media posters, with TMDB's image service.

## 1. Information Stored Locally

MediaManagarr uses your browser's extension storage (`chrome.storage.local` or its browser-compatible equivalent) to store information needed for its functionality.

This may include:

- Configured service URLs and API keys.
- Extension settings and service selections.
- Jellyfin user selections and media identifiers.
- Notification and recently added media state.
- Service connection and health status.

API keys are stored locally in browser extension storage. They are not additionally encrypted by MediaManagarr.

This information is not uploaded to any MediaManagarr developer-operated server.

## 2. Communication With Your Services

MediaManagarr communicates directly with the self-hosted services you configure:

- **Jellyfin:** Retrieves media, user, and image information.
- **Seerr:** Retrieves media requests and related information.
- **Sonarr and Radarr:** Retrieves calendar and media information.
- **qBittorrent:** Retrieves torrent and transfer information and performs actions you request.

The extension sends the authentication credentials required by each service directly to its configured server.

Depending on the feature, these requests may transmit service identifiers, media identifiers, query parameters, and other information necessary to perform the requested operation.

Your configured servers and any reverse proxies between your browser and those servers handle this information according to their own configurations and policies.

MediaManagarr does not send these credentials or service responses to the extension developer.

## 3. Automatic Background Requests

MediaManagarr performs certain background operations when the relevant services are configured and enabled.

These include:

- Periodic Jellyfin scans for recently added media.
- Periodic service connection and health checks.

These requests may occur without a new user action each time. They use the configured service URLs and authentication credentials.

## 4. Third-Party Poster Images

MediaManagarr displays certain media posters using TMDB's image service at `image.tmdb.org`.

When these posters are displayed, your browser may make HTTPS image requests directly to TMDB.

These requests can expose network information such as your IP address and the requested poster path to TMDB. The requested image may indicate which media title is being displayed.

MediaManagarr does not intentionally include your self-hosted service API keys or credentials in these poster image URLs.

TMDB handles these requests under its own privacy practices.

## 5. Analytics, Tracking, and Crash Reporting

MediaManagarr does not:

- Collect usage analytics or telemetry.
- Send automatic crash reports to the developer.
- Use advertising or behavioral tracking services.
- Operate a developer-controlled service that receives your API keys or media activity.
- Sell your personal information.

## 6. Browser Permissions

MediaManagarr uses the following browser permissions:

- **Storage:** To save service configurations, settings, and extension state locally.
- **Alarms:** To schedule background service checks and Jellyfin scans.
- **Optional host permissions:** To communicate with self-hosted services that you explicitly configure.

Optional host access is requested for the relevant server rather than granting access to every website automatically.

MediaManagarr does not use these permissions to collect browsing history.

## 7. Data Retention and Deletion

Locally stored information remains in browser extension storage until it is changed, cleared, or removed.

You can remove configured services through the extension's available configuration controls.

Uninstalling MediaManagarr normally removes its extension-local storage, subject to browser behavior and any browser-managed backups.

Removing locally stored information does not delete information held by your self-hosted services or TMDB.

## 8. Security

MediaManagarr uses the service URLs you configure, which may use HTTP or HTTPS.

HTTPS is recommended, particularly when accessing services over untrusted networks.

Authentication credentials are used to communicate with your configured services. MediaManagarr rejects HTTP redirects on authenticated API requests to reduce the risk of credentials being forwarded to unexpected destinations.

Because API keys are stored in browser extension storage, users should protect their browser profiles and devices against unauthorized access.

## 9. Changes to This Policy

This privacy policy may be updated when MediaManagarr's functionality or data handling practices change.

Updates will be published in the project's repository.

## 10. Contact

For privacy questions or concerns, please open an issue in the MediaManagarr GitHub repository:

https://github.com/yansudeansu/mediamanagarr/issues
