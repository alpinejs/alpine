let mix = require('laravel-mix');

// Allow both "alpine.js" && "alpine.min.js"
// to both exist in the mix.manifest file.
require('laravel-mix-merge-manifest');

const outputFileName = process.env.NODE_ENV === 'production'
    ? 'alpine.min.js'
    : 'alpine.js'

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
