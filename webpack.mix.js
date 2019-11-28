let mix = require('laravel-mix');

// Allow both "project-x.js" && "project-x.min.js"
// to both exist in the mix.manifest file.
require('laravel-mix-merge-manifest');

const outputFileName = process.env.NODE_ENV === 'production'
    ? 'project-x.min.js'
    : 'project-x.js'

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
