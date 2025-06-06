# jolly job aid (开心工作助手)

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
# 指定源
npx jjs pkg -d=淘宝
npx jjs pkg -d=腾讯
npx jjs pkg -d=中科大
npx jjs pkg -d=yarn
# 默认源 （指定值不存在则默认使用 `官方`）
npx jjs pkg -d=官方
```

### `update`

```bash
npx jja up
```

升级前尽量保证你的功能完善，且 git 目录干净

### dns

添加了域名解析，使用线上的域名，目前仅支持 `A` 记录的查询

```bash
# 简单使用（将返回 github.com 的解析地址）
npx jja dns
# 使用自定义的网址
npx jja dns --domain=www.npmjs.com
npx jja dns -d=www.npmjs.com
# 使用自定义的判断联通的接口（默认 443）
npx jja dns --port=80
npx jja dns -p=80
# 展示每一个测试的 dns 信息
npx jja dns --not-covered
npx jja dns -n
```

## 📄 文档地址

参看 [https://earthnut.dev/jja/](https://earthnut.dev/jja/)
