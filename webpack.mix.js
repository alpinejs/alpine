let mix = require('laravel-mix');

// Allow both "rename-me.js" && "rename-me.min.js"
// to both exist in the mix.manifest file.
require('laravel-mix-merge-manifest');

const outputFileName = process.env.NODE_ENV === 'production'
    ? 'rename-me.min.js'
    : 'rename-me.js'

mix
    .js('src/index.js', outputFileName)
    .setPublicPath('dist')
    .version()
    .mergeManifest();

mix.webpackConfig({
    output: {
        libraryTarget: 'umd',
    }
});
