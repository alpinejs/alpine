let fs = require('fs')
let chalk = require('chalk');
let log = message => console.log(chalk.green(message))

let DotJson = require('dot-json');

let { exec } = require('child_process')

let version = getFromPackageDotJson('docs', 'version')

let revision = version.match(/revision\.([0-9]+)/)[1]

let newVersion = version.replace('revision.'+revision, 'revision.'+(Number(revision) + 1))

console.log('Bumping docs from '+version+' to '+newVersion);

writeToPackageDotJson('docs', 'version', newVersion)

console.log('Publishing on NPM...');

runFromPackage('docs', 'npm publish --access public')

function runFromPackage(package, command) {
    exec(command, { cwd: __dirname+'/../packages/'+package })
}

function writeToPackageDotJson(package, key, value) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    dotJson.set(key, value).save()
}

function getFromPackageDotJson(package, key) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    return dotJson.get(key)
}
