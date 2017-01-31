[👈 Back to README](../README.md)

# Development

*Prerequisites:* [node](https://docs.npmjs.com/cli/install) v7.0.0, [npm](https://nodejs.org/download/) v3.10.

1. Create a [new profile](https://developer.mozilla.org/Firefox/Multiple_profiles) for Pulse development. Launch that profile in either [Developer Edition](https://www.mozilla.org/firefox/developer/) or [Nightly](https://www.mozilla.org/firefox/channel/desktop#nightly).
1. Install the [DevPrefs](https://addons.mozilla.org/firefox/addon/devprefs/) and [Extension Auto-Installer](https://addons.mozilla.org/firefox/addon/autoinstaller/) add-ons.
1. Clone the repository and install the dependencies:

    ```sh
    git clone https://github.com/mozilla/pulse.git
    cd pulse
    npm install
    ```
 
1. Run the following command to build the extension and install it to Firefox. While running, it will watch for changes and update the browser to the latest version of the add-on:

    ```sh
    npm run watch
    ```

1. Use the [Browser Console](https://developer.mozilla.org/docs/Tools/Browser_Console) to debug. Filter the log with `pulse.` to filter out messages not logged by Pulse.


## Architecture

Pulse is an [Embedded WebExtension](https://developer.mozilla.org/Add-ons/WebExtensions/Embedded_WebExtensions); an SDK add-on that wholly wraps a WebExtension.

The SDK add-on is responsible for:

- Creating a `<notificationbox>` element to collect prompted feedback.
- Establishing a communication channel with the WebExtension.
- Collecting browser analytics to be submitted to telemetry.
- Relaying those analytics to Test Pilot for submission.

While the WebExtension:

- Adds the toolbar icon to the address bar.
- Serves the survey to collect information from the user.


### Survey

Because extensions cannot run content scripts on other extensions' hosted pages, you cannot use the [React Developer Tools](https://addons.mozilla.org/firefox/addon/react-devtools/) to debug the survey in context of the add-on. To work around this, a command is included to run the survey from a development server:

``` bash
npm run survey
```

While the server is running, it can be accessed at [http://localhost:8080/webextension/survey/](http://localhost:8080/webextension/survey/). The survey bundle is recompiled with each change, but is not hot reloaded.


## Style

Pulse follows the default formatting recommendations provided by [`prettier`](https://github.com/jlongster/prettier), but with single quotes. To lint the source tree:

```sh
npm run lint
```

Builds will fail if linting fails.

To automatically clean up the working tree, run:

```sh
npm run prettier
```
