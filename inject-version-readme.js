// Replace pinned version in README to latest (per package.json version field)
const fs = require('fs');
const pkg = require('./package.json');

const readmeTranslations = fs.readdirSync('.').filter((name) => name.includes('README'))
readmeTranslations.forEach((readmeName) => {
    const original = fs.readFileSync(readmeName, 'utf8')
    const updated = original.replace(/[0-9]+\.[0-9]+\.[0-9]+/gi, pkg.version)
    fs.writeFileSync(readmeName, updated, 'utf8')
})
