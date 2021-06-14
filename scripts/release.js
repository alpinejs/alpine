let { runFromPackage, writeToPackageDotJson } = require('./utils')
let chalk = require('chalk');
let log = message => console.log(chalk.green(message))
let version = process.argv[2]

if (! version) {
    return console.log('Whoops, you must pass in a version number to this command as the argument')
}

if (! /[0-9]+\.[0-9]+\.[0-9]+/.test(version)) {
    return console.log('Whoops, the supplies version is invalid: '+version)
}

writeNewAlpineVersion()
writeNewDocsVersion()
buildAssets()

let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

setTimeout(() => {
    readline.question('Are you sure you want to publish this release: '+version+'?', answer => {
        if (['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer)) publish()

        readline.close();
    });
}, 1000)

function writeNewAlpineVersion() {
    writeToPackageDotJson('alpinejs', 'version', version)
    console.log('Bumping alpinejs package.json: '+version);
}

function writeNewDocsVersion() {
    let versionWithRevisionSuffix = `${version}.revision.1`

    writeToPackageDotJson('docs', 'version', versionWithRevisionSuffix)
    console.log('Bumping @alpinejs/docs package.json: '+version);
}

function buildAssets() {
    console.log('Building assets...')
    require('./build')
}

function publish() {
    console.log('Publishing alpinejs on NPM...');
    runFromPackage('alpinejs', 'npm publish')

    console.log('Publishing @alpinejs/docs on NPM...');
    runFromPackage('docs', 'npm publish')

    log('\n\nFinished!')
}
