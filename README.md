# Alpine.js

Go to the Alpine docs for most things: [Alpine Docs](https://alpinejs.dev)

You are welcome to submit updates to the docs by submitting a PR to this repo. Docs are located in the [`/packages/docs`](/packages/docs) directory.

Stay here for contribution-related information.

> Looking for V2 docs? [here they are](https://github.com/alpinejs/alpine/tree/v2.8.2)

<p align="center"><a href="https://alpinejs.dev/patterns"><img src="/hero.jpg" alt="Alpine Component Patterns"></a></p>

## Contribution Guide:

### Quickstart

* clone this repo locally
* run `npm install` & `npm run build`
* Include the `/packages/alpinejs/dist/cdn.js` file from a `<script>` tag on a webpage and you're good to go!

### Brief Tour
You can get everything installed with: `npm install` in the root directory of this repo after cloning it locally.

This repo is a "mono-repo" using npm workspaces for managing the packages. Each package has its own folder in the `/packages` directory.

Rather than having to run separate builds for each package, all package bundles are handled with the same command: `npm run build`

Here's a brief look at each package in this repo:

Package | Description
--- | ---
[alpinejs](packages/alpinejs) | The main Alpine repo with all of Alpine's core
[collapse](packages/collapse) | A plugin for expanding and collapsing elements using smooth animations
[csp](packages/csp) | A repo to provide a "CSP safe" build of Alpine
[docs](packages/docs) | The Alpine documentation
[focus](packages/focus) | A plugin that allows you to manage focus inside an element
[history](packages/history) | A plugin for binding data to query string parameters using the history API (name is likely to change)
[intersect](packages/intersect) | A plugin for triggering JS expressions based on elements intersecting with the viewport
[mask](packages/mask) | A plugin for automatically formatting a text input field as a user types
[morph](packages/morph) | A plugin for morphing HTML (like morphdom) inside the page intelligently
[persist](packages/persist) | A plugin for persisting Alpine state across page loads

The compiled JS files (as a result of running `npm run [build/watch]`) to be included as a `<script>` tag for example are stored in each package's `packages/[package]/dist` directory.

Each package should at least have: a "cdn" build that is self-initializing and can be included using the `src` attribute in a `<script defer>` tag, and a `module.[esm/cjs].js` file that is used for importing as a JS module (cjs for node, esm for everything else).

The bundling for Alpine V3 is handled exclusively by ESBuild. All of the configuration for these builds is stored in the `scripts/build.js` file.

### Testing
There are 2 different testing tools used in this repo: Cypress (for integration tests), and Jest (for unit tests).

All tests are stored inside the `/tests` folder under `/tests/cypress` and `/tests/jest`.

You can run them both from the command line using: `npm run test`

If you wish to only run cypress and open it's user interface (recommended during development), you can run: `npm run cypress`

If you wish to only run Jest tests, you can run `npm run jest` like normal and target specific tests. You can specify command line config options to forward to the jest command with `--` like so: `npm run jest -- --watch`
