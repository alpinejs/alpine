let { runFromPackage, writeToPackageDotJson, ask, run } = require('./utils')
let chalk = require('chalk');
let log = message => console.log(chalk.green(message))
let version = process.argv[2]
let axios = require('axios').create({
    headers: { Authorization: `Bearer ${require('./.env.json').GITHUB_TOKEN}` }
})

if (! version) {
    return console.log('Whoops, you must pass in a version number to this command as the argument')
}

if (! /[0-9]+\.[0-9]+\.[0-9]+/.test(version)) {
    return console.log('Whoops, the supplies version is invalid: '+version)
}

writeNewAlpineVersion()
writeNewDocsVersion()
buildAssets()

setTimeout(() => {
    ask('Have you reviewed, committed, and pushed all the files for this release?', () => {
        draftRelease(version, () => {
            ask('Are you sure you want to publish this release: '+version+'?', () => publish())
        })
    })
}, 1000)

function writeNewAlpineVersion() {
    writeToPackageDotJson('alpinejs', 'version', version)
    console.log('Bumping alpinejs package.json: '+version);
}

function writeNewDocsVersion() {
    let versionWithRevisionSuffix = `${version}-revision.1`

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
    runFromPackage('docs', 'npm publish --access public')

    log('\n\nFinished!')
}

async function draftRelease(name, after = () => {}) {
    let lastRelease = await getLastRelease()

    let since = lastRelease.published_at

    let pulls = await getPullRequestsSince(since)

    let output = ''

    output += "## Added\n\n## Fixed\n\n"

    output += pulls.map(pull => `* ${pull.title} [#${pull.number}](${pull.html_url})`).join('')

    let fs = require('fs')

    fs.writeFileSync('./changelog.tmp', output)

    run('code ./changelog.tmp')

    ask('Are you finished editing the changelog?', () => {
        let content = fs.readFileSync('./changelog.tmp', 'utf8')

        fs.unlinkSync('./changelog.tmp')

        tagNewRelease(name, content).then(() => after)
    })
}

async function getLastRelease() {
    let { data: releases } = await axios.get('https://api.github.com/repos/alpinejs/alpine/releases')

    let lastRelease = releases.find(release => {
        return release.target_commitish === 'main'
            && release.draft === false
    })

    return lastRelease
}

async function getPullRequestsSince(since) {
    let { data: pulls } = await axios.get('https://api.github.com/repos/alpinejs/alpine/pulls?state=closed&sort=updated&direction=desc&base=main')

    let pullsSince = pulls.filter(pull => {
        if (! pull.merged_at) return false

        return pull.merged_at > since
    })

    return pullsSince
}

async function tagNewRelease(name, content) {
    await axios.post('https://api.github.com/repos/alpinejs/alpine/releases', {
        name: name,
        tag_name: name,
        target_commitish: 'main',
        body: content,
        draft: true,
    })
}