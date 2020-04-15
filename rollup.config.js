import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import stripCode from 'rollup-plugin-strip-code';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/index.js',
    output: {
        name: 'Alpine',
        file: 'dist/alpine.js',
        format: 'umd',
    },
    plugins: [
        // 'observable-membrane' uses process.env. We don't have that...
        replace({ "process.env.NODE_ENV": "'production'" }),
        resolve(),
        filesize(),
        babel({
            exclude: 'node_modules/**'
        }),
        stripCode({
            start_comment: 'IE11-ONLY:START',
            end_comment: 'IE11-ONLY:END'
        }),
        terser(),
    ],
}
