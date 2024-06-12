import {
  Color,
  cursorMoveUp,
  fileExist,
  getNpmPkgInfo,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
} from "ismi-node-tools";
import { ParamsDataType } from "./types";
import command from "./command";
import { getDirectoryBy } from "./tools";

/** 到处包管理的绑定信息 */
export const packageBind = {
  "package <pkg>  (包管理)": [
    "--diff <-d>  (分析当下包的差异)",
    `--upDependencies <-u> (更新依赖，跟 ${Color.random("npm update")} 一样)`,
  ],
};

/** 包管理的一些东西 */
export async function packageManage(params: ParamsDataType) {
  /** 依赖更新 */
  if (params["--upDependencies"]) {
    await updateDependence();
  } else if (params["--diff"]) {
    /** 检测当前版本 */
    await diffPackage(true);
  } else {
    /** 其余的执行帮助文档 */
    command.help("package");
  }
}

/** 升级依赖 */
export async function updateDependence(log: boolean = true) {
  // 判断当前目录下是否存在 package.json 文件
  const cwd = getDirectoryBy("package.json", "file");
  if (cwd == undefined)
    return console.log("当前目录下不存在 package.json 文件");
  // 抓取依赖数据
  const dependencies =
    readFileToJsonSync(pathJoin(cwd, "package.json")).dependencies || {};
  log && console.log(Color.green("初始化完成，等待下一步命令"));
  // 遍历查找依赖更新
  for (let i = Object.keys(dependencies), j = i.length, k = 0; k < j; k++) {
    const currentEle = i[k];
    log && console.log(Color.cyan(`正在检测依赖 ${currentEle} 版本状态`));
    const tempVersion = (await getNpmPkgInfo(currentEle))[0].version;
    /** 检测版本是否需要更新 */
    if ((dependencies[currentEle] as string).endsWith(tempVersion)) {
      log &&
        (cursorMoveUp(),
        console.log(`依赖 ${currentEle} 已是新版本，无需更新`));
      continue;
    }
    log &&
      console.log(
        `依赖 ${currentEle} 当前版本（${dependencies[currentEle].replace(
          /^.*?(\d.*)$/,
          "$1"
        )}），最新版本 （${tempVersion}） `
      );
    // npm 会自动把其安装在父级类文件夹下
    await runOtherCode(`npm install ${currentEle}@latest --save`);
    log &&
      (cursorMoveUp(),
      console.log(Color.green(`依赖 ${currentEle} 更新到 ${tempVersion}完毕`)));
  }
  log && console.log(Color.cyan(`正在更新 dev 依赖`));
  // npm 会自动把其安装在父级类文件夹下
  await runOtherCode({ code: `npm update --save` });
  log && (cursorMoveUp(), console.log(`开发依赖更新完毕`));
}

/** 检测当前包状态
 *
 * @returns 返回为一个 Promise ，可捕获值为一个数组
 * - 当数组为空，则证明当前未找到包 package.json
 * - 当数组仅有一个值，可能该包尚未上线
 * - 当数组为两个元素，第一个元素是当前的版本号，第二个元素是线上的版本号
 */
export async function diffPackage(log: boolean = false): Promise<string[]> {
  /// 当前工作目录
  const currentWordDirectory = getDirectoryBy("package.json", "file");
  if (currentWordDirectory == undefined) return [];
  // 获取文件
  const packageInfo =
    readFileToJsonSync(pathJoin(currentWordDirectory, "package.json")) || {};
  const name = packageInfo.name;
  const version = packageInfo.version;
  if (!version) {
    console.log(
      Color.fromHexadecimal(`未检测到当前包 ${name} 的版本号`, "#25f9aa")
    );
    return [];
  }
  const tempInfo = (await getNpmPkgInfo(name))[0];
  // 当前显示的包名与后台抓来的不一致，可能是当前包尚未发布。或者抓取错误
  if (tempInfo.name !== name) return [version];
  log &&
    console.log(Color.fromHexadecimal(`当前包本地版本为: ${version}`, "#931"));
  log &&
    console.log(
      Color.fromHexadecimal(
        " ".repeat(6).concat(`线上版本为: ${tempInfo.version}`),
        "#399"
      )
    );
  return [version, tempInfo.version];
}
