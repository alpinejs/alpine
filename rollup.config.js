import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve"
import stripCode from 'rollup-plugin-strip-code';
import pkg from './package.json';

export default [
    {
        input: 'src/index.js',
        output: {
            name: 'Alpine',
            file: pkg.main,
            format: 'umd',
            sourcemap: true,
        },
        plugins: [
            resolve(),
            filesize(),
            terser({
                mangle: false,
                compress: {
                    drop_debugger: false,
                },
            }),
            babel({
                exclude: 'node_modules/**'
            }),
            stripCode({
                start_comment: 'IE11-ONLY:START',
                end_comment: 'IE11-ONLY:END'
            })
        ]
    },
    {
        input: 'src/index.js',
        output: {
            name: 'Alpine ES Module',
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
        plugins: [
            resolve(),
            filesize(),
            terser({
                mangle: false,
                compress: {
                    drop_debugger: false,
                },
            }),
            babel({
                exclude: 'node_modules/**'
            }),
            stripCode({
                start_comment: 'IE11-ONLY:START',
                end_comment: 'IE11-ONLY:END'
            })
        ]
    }
]
