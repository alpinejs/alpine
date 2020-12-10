import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import stripCode from 'rollup-plugin-strip-code';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: {
        name: 'Alpine',
        file: 'dist/alpine.mjs',
        format: 'es',
    },
    plugins: [
        replace({
            // 'observable-membrane' uses process.env. We don't have that...
            "process.env.NODE_ENV": "'production'",
            // inject Alpine.js package version number
            "process.env.PKG_VERSION": `"${pkg.version}"`
        }),
        resolve(),
        filesize(),
        stripCode({
            start_comment: 'IE11-ONLY:START',
            end_comment: 'IE11-ONLY:END'
        })
    ]
}
