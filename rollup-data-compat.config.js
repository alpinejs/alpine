// Config to generate a build of Alpine.js with no `x-*` custom attributes
// used with `data-alpine-*` instead
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import stripCode from 'rollup-plugin-strip-code';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: {
        name: 'Alpine',
        file: 'dist/alpine-data-compat.js',
        format: 'umd',
    },
    plugins: [
        replace({
            // 'observable-membrane' uses process.env. We don't have that...
            "process.env.NODE_ENV": "'production'",
            // inject Alpine.js package version number
            "process.env.PKG_VERSION": `"${pkg.version}"`,
            // rollup replace yields `data-data-x` if
            // you try to replace with `data-x`,
            // use `data-alpine` instead
            "x-": "data-alpine-",
            // skip word delimiters
            delimiters: ['', '']
        }),
        resolve(),
        filesize(),
        babel({
            exclude: 'node_modules/**'
        }),
        stripCode({
            start_comment: 'IE11-ONLY:START',
            end_comment: 'IE11-ONLY:END'
        })
    ]
}
