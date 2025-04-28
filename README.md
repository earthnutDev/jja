# jja

[![version](<https://img.shields.io/npm/v/jja.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja) [![issues 提交](<https://img.shields.io/badge/issues-提交-rgb(255,0,63)?logo=github>)](https://github.com/earthnutDev/jja/issues)

---

## 📦 安装

```sh
npm install --save-dev  jja
```

## 📖 命令

- [remove ：与删除文件相关](#remove)
- [package：与 package.json 包相关](#package)
- `cls`、`clear`：清理终端屏幕，两个作用相同

### `remove`

可用 `npx jja  rm  <filename>  <filename>  <...>` 的模式进行移除文件或文件夹

```bash
npx jja  rm <filename>
```

如果不想显示该过程的 `log` 信息，可以使用 `-i` 忽略掉:

```bash
npx jja  rm  -i  filename
```

### `package`

使用 `--diff` 或 `-d` 进行 `package.json` 文件内的依赖版本的检测，查看是否有更新（更新以本地安装的应用版本为准，而不是以 package.json 文件给出的范围）可用，给出反馈

```bash
npx jja package --diff
# 或者使用缩写
npx jjs pkg -d
```

### `update`

```bash
npx jja up
```

升级前尽量保证你的功能完善，且 git 目录干净

## 📄 文档地址

参看 [https://earthnut.dev/jja/](https://earthnut.dev/jja/)
