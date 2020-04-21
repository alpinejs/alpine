import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';

export default {
    input: ['src/polyfills.js', 'src/index.js'],
    output: {
        name: 'Alpine',
        file: 'dist/alpine-ie11.js',
        format: 'umd',
    },
    plugins: [
        multi(),
        commonjs(),
        replace({
            // 'observable-membrane' uses process.env. We don't have that...
            "process.env.NODE_ENV": "'production'",
            // inject Alpine.js package version number
            "process.env.PKG_VERSION": `"${pkg.version}"`
        }),
        resolve(),
        filesize(),
        babel({
            babelrc: false,
            exclude: 'node_modules/**',
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            browsers: "> 0.5%, ie >= 11"
                        },
                        modules: false,
                        spec: true,
                        useBuiltIns: "usage",
                        forceAllTransforms: true,
                        corejs: {
                            version: 3,
                            proposals: false
                        }
                    }
                ]
            ]
        })
    ]
}
