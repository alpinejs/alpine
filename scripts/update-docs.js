let { runFromPackage, getFromPackageDotJson, writeToPackageDotJson } = require('./utils')

let version = getFromPackageDotJson('docs', 'version')

let revision = version.match(/revision\.([0-9]+)/)[1]

let newVersion = version.replace('revision.'+revision, 'revision.'+(Number(revision) + 1))

console.log('Bumping docs from '+version+' to '+newVersion);

writeToPackageDotJson('docs', 'version', newVersion)

console.log('Publishing on NPM...');

runFromPackage('docs', 'npm publish --access public')

let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

setTimeout(() => {
    readline.question('Do you want to deploy this new version to the docs site?', answer => {
        if (['y', 'Y', 'yes', 'Yes', 'YES'].includes(answer)) deploy()

        readline.close();
    });
}, 1000)

function deploy() {
    let https = require('https');
    let { DOCS_DEPLOY_URL } = require('./.env.json')

    https.get(DOCS_DEPLOY_URL, (resp) => {
        resp.on('end', () => console.log('\n\n Successfully deployed!'))
    }).on("error", err => console.log("Error: " + err.message));
}
