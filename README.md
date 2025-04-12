# jja

[![version](<https://img.shields.io/npm/v/jja.svg?logo=npm&logoColor=rgb(0,0,0)&label=版本号&labelColor=rgb(73,73,228)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja) [![NPM Last Update](<https://img.shields.io/npm/last-update/jja?logo=npm&label=版本最后更新&labelColor=rgb(255,36,63)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja) [![📦 size](<https://img.shields.io/bundlephobia/minzip/jja.svg?logo=npm&label=压缩包大小&labelColor=rgb(201,158,140)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja) [![downloads](<https://img.shields.io/npm/dm/jja.svg?logo=npm&logoColor=rgb(0,0,0)&label=月下载量&labelColor=rgb(194,112,210)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja) [![downloads](<https://img.shields.io/npm/dt/jja.svg?logo=npm&label=总下载量&labelColor=rgb(107,187,124)&color=rgb(0,0,0)>)](https://www.npmjs.com/package/jja)

[![last commit](<https://img.shields.io/github/last-commit/earthnutDev/jja.svg?logo=github&logoColor=rgb(0,0,0)&label=最后推码&labelColor=rgb(255,165,0)&color=rgb(0,0,0)>)](https://github.com/earthnutDev/jja) [![GitHub commit activity](<https://img.shields.io/github/commit-activity/y/earthnutDev/jja.svg?logo=github&label=推码数&labelColor=rgb(128,0,128)&color=rgb(0,0,0)>)](https://github.com/earthnutDev/jja) [![Coverage Status](<https://img.shields.io/coverallsCoverage/github/earthnutDev/jja?logo=coveralls&label=coveralls&labelColor=rgb(12, 244, 39)&color=rgb(0,0,0)>)](https://coveralls.io/github/earthnutDev/jja?branch=main) [![codecov](<https://img.shields.io/codecov/c/github/earthnutDev/jja/main?logo=codecov&label=codecov&labelColor=rgb(7, 245, 245)&color=rgb(0,0,0)>)](https://codecov.io/gh/earthnutDev/jja)

[![查看 📔 日志](<https://img.shields.io/badge/👀-日_%20_志-rgb(0,125,206)>)](https://github.com/earthnutDev/jja/blob/main/CHANGELOG.md) [![bug 🙋‍♂️ 提交](<https://img.shields.io/badge/☣️-bug_%20_提交-rgb(255,0,63)>)](https://github.com/earthnutDev/jja/issues)

---

## 📦 安装

```sh
npm install --save-dev  jja
```

## 📖 命令

定义了两个命令，一个是 remove ，另一个是 update

### `remove`

你可以使用 `npx jja  rm  <filename>  <filename>  <...>` 的模式进行移除文件或文件夹，而不再担心“我的 windows 命令在 macos 上没法用呀！！”、“我在 windows 上移除文件夹，文件不存在报错” （不好吧，我就是为了解决这两个问题才呕心沥血加了这个小功能，希望你能喜欢）

```bash
npx jja  rm <filename>
```

如果不想显示该过程的 `log` 信息，可以使用 `-i` 忽略掉:

```bash
npx jja  rm  -i  filename
```

### `update`

```bash
npx jja up
```

升级前尽量保证你的功能完善，且 git 目录干净

## 📄 文档地址

参看 [https://earthnut.dev/jja/](https://earthnut.dev/jja/)
