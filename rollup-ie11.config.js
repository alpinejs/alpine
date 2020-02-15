import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve"
import commonjs from '@rollup/plugin-commonjs'
import multi from '@rollup/plugin-multi-entry';

export default {
    input: ['src/polyfills.js', 'src/index.js'],
    output: {
        name: 'Alpine',
        file: 'dist/alpine-ie11.js',
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        multi(),
        commonjs(),
        resolve(),
        filesize(),
        terser({
            mangle: false,
            compress: {
                drop_debugger: false,
            }
        }),
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
