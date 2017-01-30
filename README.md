![Pulse icon](src/icons/pulse-64.png)


# pulse

[![Available on Test Pilot](https://img.shields.io/badge/available_on-Test_Pilot-0996F8.svg)](https://testpilot.firefox.com/experiments/pulse)
[![CircleCI](https://img.shields.io/circleci/project/github/RedSparr0w/node-csgo-parser.svg)](https://circleci.com/gh/mozilla/pulse)

Pulse is an upcoming [Test Pilot](https://testpilot.firefox.com) experiment that intends to align user satisfaction and perceived performance with more traditional performance metrics.


## Development

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


### Architecture

Pulse is an [Embedded WebExtension](https://developer.mozilla.org/Add-ons/WebExtensions/Embedded_WebExtensions); an SDK add-on that wholly wraps a WebExtension.

The SDK add-on is responsible for:

- Creating a `<notificationbox>` element to collect prompted feedback.
- Establishing a communication channel with the WebExtension.
- Collecting browser analytics to be submitted to telemetry.
- Relaying those analytics to Test Pilot for submission.

While the WebExtension:

- Adds the toolbar icon to the address bar.
- Serves the survey to collect information from the user.


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


## More Information

- License: [MIT](license.md)
- Code of conduct: Based on the [Contributor Covenant](code_of_conduct.md)
- IRC: `#testpilot` on irc.mozilla.org
