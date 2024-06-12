# ixxx package scripts 解读

## b

```sh
   "b": "rollup --config rollup.config.js && tsc -p tsconfig.types.json"
```

该命令执行了 `rollup` 打包和 `tsc` 命令，先通过 `rollup` 进行了打包，然后使用 `tsc` 命令生成类型声明 `.d.ts` 文件

## build

```sh
    "build": "npx ixxx rm out types  run b",
```

执行了清理 `npx ixxx` 命令下的 `rm` ，移除了 `out`、` types` 目录，之后执行了 `npx ixxx` 下的 `run` 命令，执行参数 `b`
映射到 `npm run b`

## clean

```sh
    "clean": "npx ixxx  up -d  rm out types node_modules run  npm install run b",
```

- 首先执行了 `npx ixxx` 命令下 `up -d` ，更新了 npm 依赖包
- 紧接着执行 `npx ixxx` 命令下的 `rm` 命令，移除了 `out`、`types`、`node_modules` 目录
- 然后执行了 `npx ixxx` 命令下的 `run` 命令，执行了`npm install`
- 最后执行了 `npx ixxx` 命令下的 `run` 命令，执行了 `b` 映射到了 `npm run b`;

## test

```sh
    "test": "npx ixxx  rm out types  run b  &&  node bin/ixxx.js",
```

- 执行了 `npx ixxx` 命令下的 `remove` 命令，移除了 `out`、`types`
- 然后执行 `npx ixxx` 命令下的 `runOther` 命令，执行了 `npm run b`
- 最后执行了 `node bin/bin/ixxx/js`

##

```sh
    "up": "npx ixxx up -n"
```

- 执行了 `npx ixxx` 命令下的 `update --npm-publish`
