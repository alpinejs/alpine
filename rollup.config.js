import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve"
import stripCode from 'rollup-plugin-strip-code';

export default {
    input: 'src/index.js',
    output: {
        name: 'Alpine',
        file: 'dist/alpine.js',
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
}
