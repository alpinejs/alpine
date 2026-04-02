let { writeToPackageDotJson, getFromPackageDotJson } = require('./utils')
let { execSync } = require('child_process')
let fs = require('fs')

let version = process.argv[2]
let prevVersion = getFromPackageDotJson('alpinejs', 'version')

if (! version) {
    console.log('Usage: node scripts/prep-release.js <version>')
    console.log('Example: node scripts/prep-release.js 3.15.11')
    process.exit(1)
}

if (! /^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) {
    console.log('Invalid version format: ' + version)
    process.exit(1)
}

if (version === prevVersion) {
    console.log('Version ' + version + ' is already the current version.')
    process.exit(1)
}

let run = cmd => execSync(cmd, { cwd: __dirname + '/..', stdio: 'inherit' })

// Bump all package.json versions
let packages = [
    'alpinejs', 'docs', 'ui', 'csp', 'intersect', 'resize',
    'persist', 'focus', 'collapse', 'anchor', 'morph', 'mask', 'sort',
]

packages.forEach(pkg => {
    writeToPackageDotJson(pkg, 'version', version)
    console.log('Bumped ' + pkg + ' to ' + version)
})

// Update installation docs
let docsFile = __dirname + '/../packages/docs/src/en/essentials/installation.md'
let docs = fs.readFileSync(docsFile, 'utf8')
docs = docs.replace(prevVersion, version)
fs.writeFileSync(docsFile, docs)
console.log('Updated installation docs: ' + prevVersion + ' -> ' + version)

// Commit and push
run('git add -A')
run('git commit -m "Bump version to ' + version + '"')
run('git push')

console.log('\nDone! Opening GitHub release page...\n')

// Open the new release page with the tag pre-filled
let url = 'https://github.com/alpinejs/alpine/releases/new?tag=v' + version + '&target=main&title=v' + version
run('open "' + url + '"')
