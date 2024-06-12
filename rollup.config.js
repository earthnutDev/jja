import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import cleanup from "rollup-plugin-cleanup";

export default {
  input: "./actions.ts",
  output: [
    {
      format: "es",
      entryFileNames: "[name].mjs",
      preserveModules: true,
      sourcemap: false,
      exports: "named",
      dir: "exportMjs",
    },
    {
      format: "cjs",
      entryFileNames: "[name].cjs",
      preserveModules: true,
      sourcemap: false,
      exports: "named",
      dir: "exportCjs",
    },
  ],
  // 配置需要排除的包
  external: (id) => /^(node:)|^(tslib)|^(ismi-)/.test(id),
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
  ],
};
