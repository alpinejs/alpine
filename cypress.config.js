const { defineConfig } = require('cypress')

module.exports = defineConfig({
    screenshotOnRunFailure: false,
    video: false,
    fixturesFolder: 'tests/cypress/fixtures',
    screenshotsFolder: 'tests/cypress/screenshots',
    videosFolder: 'tests/cypress/videos',

    e2e: {
        specPattern: 'tests/cypress/integration/**/*.spec.js',
        supportFile: 'tests/cypress/support/index.js',
    },
})
