import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
// import terser from '@rollup/plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import copy from 'rollup-plugin-copy';

export default {
  input: './index.ts',
  output: [
    {
      format: 'es',
      entryFileNames: '[name].mjs',
      preserveModules: true,
      sourcemap: false,
      exports: 'named',
      dir: 'dist/mjs',
    },
    // {
    //   format: 'cjs',
    //   entryFileNames: '[name].cjs',
    //   preserveModules: true,
    //   sourcemap: false,
    //   exports: 'named',
    //   dir: 'dist/cjs',
    // },
  ],
  // 配置需要排除的包
  external: id =>
    /^(node:)|^(tslib)|^(a-js-tools)|^(a-node-tools)|^(a-command)/.test(id),
  plugins: [
    resolve(),
    commonjs(),
    // 可打包 json 内容
    json(),
    typescript({
      // compilerOptions: {},
      // exclude: ["./node_modules", "./test"],
    }),
    // 打包压缩，自动去注释
    // terser(),
    // 去除无用代码
    cleanup(),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'LICENSE', dest: 'dist' },
        { src: 'bin', dest: 'dist' },
      ],
    }),
  ],
};
