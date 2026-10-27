# MediaManagarr User Guide

This guide explains how to install MediaManagarr, connect your self-hosted media services, and configure the extension in different browsers.

MediaManagarr currently supports:

- Jellyfin
- Seerr
- Sonarr
- Radarr
- qBittorrent

You only need to configure the services you use.

> [!IMPORTANT]
> MediaManagarr is in early development and is not yet distributed through browser extension stores.
>
> Installation currently requires browser developer tools. Compatibility testing is ongoing.

## Installation

MediaManagarr provides separate builds for Firefox-based and Chromium-based browsers.

| Browser                            | Build   |
| ---------------------------------- | ------- |
| Firefox                            | Firefox |
| Zen Browser                        | Firefox |
| Google Chrome                      | Chrome  |
| Microsoft Edge                     | Chrome  |
| Other compatible Chromium browsers | Chrome  |

Browser-specific builds do not guarantee complete compatibility.

### Download MediaManagarr

1. Open the [MediaManagarr Releases](https://github.com/yansudeansu/mediamanagarr/releases) page.
2. Select the release you want to install.
3. Download the ZIP archive matching your browser.
4. Extract the archive into a directory on your computer.

Release archives follow this naming convention:

```text
mediamanagarr-vX.Y.Z-firefox.zip
mediamanagarr-vX.Y.Z-chrome.zip
```

The extracted directory should contain `manifest.json` at its root.

### Firefox

1. Open Firefox.
2. Navigate to `about:debugging`.
3. Select **This Firefox**.
4. Click **Load Temporary Add-on**.
5. Navigate to the extracted Firefox archive.
6. Select `manifest.json`.

MediaManagarr should now appear in your browser's extension interface.

> [!NOTE]
> Temporary Firefox extensions are removed when the browser closes.
>
> You will need to load MediaManagarr again after restarting Firefox.

### Zen Browser

Zen Browser uses the Firefox extension build.

1. Open Zen Browser.
2. Navigate to `about:debugging`.
3. Select the local browser debugging target.
4. Click **Load Temporary Add-on**.
5. Navigate to the extracted Firefox archive.
6. Select `manifest.json`.

MediaManagarr should now be available in Zen Browser.

See [Zen Browser sidebar settings](#zen-browser) for instructions on changing the extension sidebar position.

### Google Chrome

1. Open Chrome.
2. Navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted Chrome archive directory.

Select the directory containing `manifest.json`, not the manifest file itself.

MediaManagarr should now appear in your installed extensions.

You can pin MediaManagarr to the toolbar for easier access.

### Microsoft Edge

Microsoft Edge uses the Chromium extension build.

1. Open Edge.
2. Navigate to `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted Chrome archive directory.

Native sidebar behavior may differ from Chrome because Edge provides its own sidebar interface.

### Updating MediaManagarr

#### Firefox and Zen Browser

1. Download and extract the updated Firefox archive.
2. Replace the files in the directory used by your temporary extension.
3. Open `about:debugging`.
4. Find MediaManagarr.
5. Click **Reload**.

If MediaManagarr is no longer listed, load the updated `manifest.json` again.

Temporary Firefox extensions do not receive automatic updates.

#### Chrome and Chromium browsers

1. Download and extract the updated Chrome archive.
2. Replace the files in the directory used by your installed extension.
3. Open your browser's extensions management page.
4. Find MediaManagarr.
5. Click **Reload**.

Keep the same extension directory when updating an unpacked installation.

Installing from another directory may create a separate extension installation.

> [!NOTE]
> Removing and reinstalling an extension may remove its saved configuration.
>
> Make sure you have access to your service credentials before reinstalling.

## Configuring services

Open MediaManagarr and select **Settings**.

Each service requires:

- **Server URL:** The address MediaManagarr uses to reach the service.
- **API key:** A credential used to authenticate requests to the service.

Example server URLs:

```text
http://192.168.1.100:8096
http://192.168.1.100:8989
https://media.example.com
```

These are examples only. Replace them with your actual service addresses.

### Server addresses

The server URL must be reachable from the browser running MediaManagarr.

If your services run on another computer, use that computer's IP address or hostname.

For example, if Jellyfin runs on a server at `192.168.1.100`, its URL might be:

```text
http://192.168.1.100:8096
```

Using `localhost` only works when the service is reachable on the same computer as your browser.

If you access your services through a reverse proxy, use the URL provided by that proxy.

Prefer HTTPS when accessing services over untrusted networks.

### Browser permissions

MediaManagarr may request permission to communicate with your configured server addresses.

Grant access only to servers you recognize.

If a connection fails, check whether your browser has denied or revoked the required permission.

## Jellyfin

Jellyfin provides recently added media, unwatched content, and notifications.

### Obtain a Jellyfin API key

1. Open your Jellyfin web interface.
2. Sign in with an administrator account.
3. Open the administration dashboard.
4. Navigate to **Advanced → API Keys**.
5. Create a new API key.
6. Give it a recognizable name, such as `MediaManagarr`.
7. Copy the generated API key.

Menu names may differ between Jellyfin versions.

Treat your API key as a password.

### Connect Jellyfin

1. Open MediaManagarr.
2. Select **Settings**.
3. Find the Jellyfin configuration.
4. Enter your Jellyfin server URL.
5. Paste your API key.
6. Grant server access if prompted.
7. Save the configuration.

Example URL:

```text
http://192.168.1.100:8096
```

### Select a Jellyfin user

After connecting Jellyfin, select the user whose media activity you want to monitor.

MediaManagarr uses the selected user for user-specific content and notification information.

If the selected user becomes unavailable, choose another valid Jellyfin user.

### Jellyfin notifications

MediaManagarr displays recently added media and provides notification management.

You can review arrivals and manage their notification state through the extension.

The available information depends on your Jellyfin library and selected user.

## Seerr

Seerr provides media requests and their statuses.

### Obtain a Seerr API key

1. Open your Seerr web interface.
2. Sign in with an administrator account.
3. Open **Settings**.
4. Locate the API key in the application's settings.
5. Copy the API key.

The exact menu location may vary depending on your Seerr version.

### Connect Seerr

1. Open MediaManagarr.
2. Select **Settings**.
3. Find the Seerr configuration.
4. Enter your Seerr server URL.
5. Paste your API key.
6. Grant server access if prompted.
7. Save the configuration.

Example URL:

```text
http://192.168.1.100:5055
```

### Media requests

Once connected, MediaManagarr displays media requests from your Seerr instance.

The Requests view supports status filtering and pagination.

Available requests and statuses depend on your Seerr configuration.

## Sonarr

Sonarr provides upcoming television episodes for the calendar.

### Obtain a Sonarr API key

1. Open Sonarr.
2. Navigate to **Settings → General**.
3. Locate the **Security** section.
4. Copy the API key.

Depending on your Sonarr version, you may need to enable advanced settings to see the relevant options.

### Connect Sonarr

1. Open MediaManagarr.
2. Select **Settings**.
3. Find the Sonarr configuration.
4. Enter your Sonarr server URL.
5. Paste your API key.
6. Grant server access if prompted.
7. Save the configuration.

Example URL:

```text
http://192.168.1.100:8989
```

### Calendar

Once connected, Sonarr contributes upcoming television episodes to MediaManagarr's Calendar view.

The displayed episodes depend on the series monitored by your Sonarr instance.

## Radarr

Radarr provides upcoming movie releases for the calendar.

### Obtain a Radarr API key

1. Open Radarr.
2. Navigate to **Settings → General**.
3. Locate the **Security** section.
4. Copy the API key.

Depending on your Radarr version, you may need to enable advanced settings to see the relevant options.

### Connect Radarr

1. Open MediaManagarr.
2. Select **Settings**.
3. Find the Radarr configuration.
4. Enter your Radarr server URL.
5. Paste your API key.
6. Grant server access if prompted.
7. Save the configuration.

Example URL:

```text
http://192.168.1.100:7878
```

### Calendar

Once connected, Radarr contributes upcoming movie releases to MediaManagarr's Calendar view.

The displayed movies depend on the titles monitored by your Radarr instance.

## qBittorrent

qBittorrent provides torrent monitoring and management.

**MediaManagarr uses qBittorrent API key authentication.**

Username and password authentication is not supported by MediaManagarr.

### Requirements

API key authentication requires **qBittorrent 5.2.0 or newer**.

Older qBittorrent versions do not provide the API key authentication required by MediaManagarr.

Official documentation:

https://github.com/qbittorrent/qBittorrent/wiki/API-Key-Authentication-%28%E2%89%A5v5.2.0%29

### Obtain a qBittorrent API key

1. Open the qBittorrent Web UI.
2. Select **Tools → Options**.
3. Open the **WebUI** tab.
4. Locate the **API Key** section.
5. Click the generate button to create an API key if one does not already exist.
6. Click the copy button to copy the API key.

The API key begins with:

```text
qbt_
```

The complete key is 32 characters long.

> [!IMPORTANT]
> qBittorrent currently supports a single API key.
>
> Regenerating the key immediately invalidates the previous one.
>
> If another application uses the same key, you will need to update its configuration after regenerating it.

### Connect qBittorrent

1. Open MediaManagarr.
2. Select **Settings**.
3. Find the qBittorrent configuration.
4. Enter your qBittorrent Web UI URL.
5. Paste the generated API key.
6. Grant server access if prompted.
7. Save the configuration.

Example URL:

```text
http://192.168.1.100:8080
```

Use your actual Web UI address and port.

The default port is commonly `8080`, but your installation may use another port or a reverse proxy.

### Torrent monitoring

Once connected, MediaManagarr displays information such as:

- Torrent names.
- Download progress.
- Download and upload speeds.
- Estimated completion times.
- Torrent statuses.

### Torrent management

MediaManagarr supports starting, stopping, and removing torrents.

Removing a torrent requires confirmation.

Deleting downloaded files is a separate, explicit option.

> [!WARNING]
> Deleting downloaded files is a destructive action.
>
> Review the confirmation dialog carefully before proceeding.

### Security

Do not expose your qBittorrent Web UI directly to the public internet without appropriate security controls.

Keep your API key private.

Use HTTPS when accessing qBittorrent over untrusted networks.

If your API key becomes compromised, generate a replacement through the qBittorrent Web UI and update MediaManagarr.

## Using MediaManagarr

### Navigation

MediaManagarr provides four main views.

| View      | Description                                           |
| --------- | ----------------------------------------------------- |
| Requests  | Browse media requests and their statuses.             |
| Up Next   | View recently added and unwatched Jellyfin content.   |
| Calendar  | View upcoming television episodes and movie releases. |
| Downloads | Monitor and manage qBittorrent torrents.              |

The information available in each view depends on your configured services.

### Settings

Use Settings to configure service connections and select your Jellyfin user.

Click the Back button to return to your previous view.

## Workspace modes

MediaManagarr supports three workspace modes.

### Toolbar popup

Click the MediaManagarr extension button in your browser toolbar.

The popup is intended for quick access to your media services.

### Detached window

Click **Detach workspace into a window** in the MediaManagarr header.

This opens MediaManagarr in a separate browser window.

Use **Attach workspace to toolbar** to close the detached window and return to the toolbar workflow.

### Native browser sidebar

Click **Open workspace in browser sidebar** in the MediaManagarr header.

The native sidebar allows MediaManagarr to remain visible while switching browser tabs.

You can generally resize the sidebar by dragging its boundary.

Sidebar position and sizing behavior are controlled by the browser.

MediaManagarr cannot force the sidebar to appear on a particular side.

## Browser-specific sidebar settings

Different browsers provide different controls for native extension sidebars.

### Firefox

Firefox supports native extension sidebars.

You can open MediaManagarr through its sidebar button or supported browser sidebar controls.

#### Move the sidebar

In recent Firefox versions:

1. Open the Firefox sidebar.
2. Open its customization options.
3. Find the sidebar position setting.
4. Select the left or right position.

Depending on your Firefox version, you may also be able to right-click the sidebar button and select **Customize Sidebar**.

For detailed instructions, see Mozilla's official guide:

https://support.mozilla.org/en-US/kb/use-sidebar-access-tools-and-vertical-tabs

### Zen Browser

Zen Browser uses Firefox's extension sidebar system.

MediaManagarr can run in the native sidebar while you continue browsing.

#### Move MediaManagarr to the right

If MediaManagarr appears on the left and you want it on the right:

1. Open a new tab in Zen Browser.
2. Navigate to `about:config`.
3. Accept the configuration warning if prompted.
4. Search for:

   ```text
   sidebar.position_start
   ```

5. Set the preference to:

   ```text
   false
   ```

6. Reopen the extension sidebar if necessary.

Setting `sidebar.position_start` to `false` places the Firefox extension sidebar on the right in the tested Zen configuration.

Setting it to `true` places the sidebar on the left.

> [!NOTE]
> This is a browser preference, not a MediaManagarr setting.
>
> Zen's sidebar implementation may change between versions.

#### Vertical tabs and extension sidebar

Zen's vertical tabs and Firefox extension sidebars are separate interface elements.

Depending on your Zen configuration, you can keep your vertical tabs on the left while displaying MediaManagarr on the right.

This arrangement has been tested during MediaManagarr development.

#### Resize the sidebar

Move your pointer to the boundary between the extension sidebar and the browser content.

Drag the boundary to adjust the sidebar width.

### Google Chrome

Chrome supports native extension side panels.

Open MediaManagarr using its sidebar button.

The side panel can remain available while switching tabs.

#### Move the side panel

Depending on your Chrome version:

1. Open Chrome's **Settings**.
2. Navigate to **Appearance**.
3. Look for the side panel position setting.
4. Select your preferred side.

If this setting is unavailable, consult your browser's current sidebar controls.

You can resize the panel by dragging its boundary.

### Microsoft Edge

Microsoft Edge is Chromium-based, but its sidebar interface differs from Chrome.

MediaManagarr uses the Chromium extension build.

Native side panel availability and behavior depend on the Edge version and its support for the required extension APIs.

If the native sidebar is unavailable, use the toolbar popup or detached window instead.

### Other Chromium browsers

Other Chromium-based browsers may support MediaManagarr's native sidebar.

However, sidebar behavior and placement vary between browsers.

If the sidebar is unavailable, use the toolbar popup or detached workspace.

## Troubleshooting

### A service connection fails

Check that:

1. The service is running.
2. The configured server URL is correct.
3. Your browser can reach the server.
4. The API key is valid.
5. MediaManagarr has permission to access the server.

Try opening the service's web interface directly in the same browser.

If your browser cannot reach the service, MediaManagarr generally cannot reach it either.

### qBittorrent cannot connect

Check that:

1. You are running qBittorrent 5.2.0 or newer.
2. The Web UI is accessible.
3. You entered the correct Web UI URL.
4. You copied the complete API key.
5. The API key has not been regenerated since you copied it.

MediaManagarr requires API key authentication.

Web UI usernames and passwords cannot be used instead.

### A service works in one browser but not another

Different browsers may handle extension permissions, certificates, and network access differently.

Check the browser's extension permissions and verify that you installed the correct build.

### HTTPS connections fail

If your service uses a self-signed certificate, the browser may not trust it.

Configure a trusted certificate where possible.

Do not disable browser security protections solely to make the extension connect.

### The sidebar does not open

Check that:

1. Your browser supports the required extension sidebar API.
2. MediaManagarr is enabled.
3. You installed the correct browser build.
4. The extension has been reloaded after an update.

If the sidebar remains unavailable, use the popup or detached window.

### The sidebar appears on the wrong side

MediaManagarr cannot control the sidebar position.

Use the browser-specific instructions above.

### The sidebar is too narrow

Try dragging the sidebar boundary to increase its width.

Minimum and maximum widths depend on the browser.

### MediaManagarr disappears after restarting Firefox or Zen

If you loaded MediaManagarr as a temporary extension, this is expected.

Temporary extensions are removed when the browser closes.

Follow the [installation instructions](#installation) to load it again.

### Changes are not visible after updating

Reload the extension through your browser's extension management interface.

Close and reopen the popup, detached window, or sidebar if necessary.

## Security and privacy

MediaManagarr connects to your self-hosted services using the API keys you configure.

Keep these credentials private.

Recommended practices:

- Use HTTPS when connecting over untrusted networks.
- Avoid exposing service management interfaces directly to the public internet.
- Grant browser permissions only to servers you trust.
- Revoke and regenerate API keys if they may have been exposed.
- Never share screenshots containing API keys or private server details.
- Review destructive actions before confirming them.

## Additional documentation

- [Project README](../README.md)
- [Contributing](../CONTRIBUTING.md)
- [Development Roadmap](ROADMAP.md)
- [MediaManagarr Releases](https://github.com/yansudeansu/mediamanagarr/releases)

For bugs or feature requests, use the project's issue tracker:

https://github.com/yansudeansu/mediamanagarr/issues

Do not include API keys, passwords, or private server details in public reports.
