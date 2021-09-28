let fs = require('fs');
let DotJson = require('dot-json');
let brotliSize = require('brotli-size');

([
    // Packages:
    'alpinejs',
    'csp',
    'history',
    'intersect',
    'persist',
    'collapse',
    'morph',
    'trap',
]).forEach(package => {
    if (! fs.existsSync(`./packages/${package}/dist`)) {
        fs.mkdirSync(`./packages/${package}/dist`, 0744);
    }

    // Go through each file in the package's "build" directory
    // and use the appropriate bundling strategy based on its name.
    fs.readdirSync(`./packages/${package}/builds`).forEach(file => {
        bundleFile(package, file)
    });
})

function bundleFile(package, file) {
    // Based on the filename, give esbuild a specific configuration to build.
    ({
        // This output file is meant to be loaded in a browser's <script> tag.
        'cdn.js': () => {
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file}`,
                bundle: true,
                platform: 'browser',
                define: { CDN: true },
            })

            // Build a minified version.
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.min.js')}`,
                bundle: true,
                minify: true,
                platform: 'browser',
                define: { CDN: true },
            }).then(() => {
                outputSize(package, `packages/${package}/dist/${file.replace('.js', '.min.js')}`)
            })

        },
        // This file outputs two files: an esm module and a cjs module.
        // The ESM one is meant for "import" statements (bundlers and new browsers)
        // and the cjs one is meant for "require" statements (node).
        'module.js': () => {
            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.esm.js')}`,
                bundle: true,
                platform: 'neutral',
                mainFields: ['main', 'module'],
            })

            build({
                entryPoints: [`packages/${package}/builds/${file}`],
                outfile: `packages/${package}/dist/${file.replace('.js', '.cjs.js')}`,
                bundle: true,
                target: ['node10.4'],
                platform: 'node',
            }).then(() => {
                writeToPackageDotJson(package, 'main', `dist/${file.replace('.js', '.cjs.js')}`)
                writeToPackageDotJson(package, 'module', `dist/${file.replace('.js', '.esm.js')}`)
            })
        },
    })[file]()
}

function build(options) {
    options.define || (options.define = {})

    options.define['ALPINE_VERSION'] = `'${getFromPackageDotJson('alpinejs', 'version')}'`
    options.define['process.env.NODE_ENV'] = process.argv.includes('--watch') ? `'production'` : `'development'`

    return require('esbuild').build({
        watch: process.argv.includes('--watch'),
        // external: ['alpinejs'],
        ...options,
    }).catch(() => process.exit(1))
}

function writeToPackageDotJson(package, key, value) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    dotJson.set(key, value).save()
}

function getFromPackageDotJson(package, key) {
    let dotJson = new DotJson(`./packages/${package}/package.json`)

    return dotJson.get(key)
}

function outputSize(package, file) {
    let size = bytesToSize(brotliSize.sync(fs.readFileSync(file)))

    console.log("\x1b[32m", `${package}: ${size}`)
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]}`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
  }
