import {
  cursorMoveUp as moveUp,
  getDirectoryBy,
  getNpmPkgInfo,
  pathJoin,
  readFileToJsonSync,
  runOtherCode,
  cursorAfterClear,
  _p,
} from 'a-node-tools';
import command from './command';
import { ArgsMapItemType } from 'a-command/types/args';
import pen from 'color-pen';

/** 到处包管理的绑定信息 */
export const packageBind = {
  'package <pkg>  (包管理)': [
    '--diff <-d>  (分析当下包的差异，该功能很鸡肋，因为线上更新比较慢)',
    `--upDependencies <-u> (更新依赖，跟 ${pen.random('npm update')} 一样)`,
  ],
};

/** 包管理的一些东西 */
export async function packageManage(params: ArgsMapItemType) {
  /** 依赖更新 */
  if (params['--upDependencies']) {
    await updateDependence(true);
  } else if (params['--diff']) {
    /** 检测当前版本 */
    await diffPackage(true);
  } else {
    /** 其余的执行帮助文档 */
    command.help('package');
  }
}

/** 升级依赖 */
export async function updateDependence(log: boolean = true) {
  // 判断当前目录下是否存在 package.json 文件
  const cwd = getDirectoryBy('package.json', 'file');
  if (cwd == undefined) return _p('当前目录下不存在 package.json 文件');
  // 抓取依赖数据
  const dependencies =
    readFileToJsonSync(pathJoin(cwd, 'package.json')).dependencies || {};
  log && _p(pen.green('初始化完成，等待下一步命令'));
  if (Object.keys(dependencies).length > 0) {
    let upNpmString = `npm install --save`;
    // 遍历查找依赖更新
    for (let i = Object.keys(dependencies), j = i.length, k = 0; k < j; k++) {
      const currentEle = i[k];
      // npm 会自动把其安装在父级类文件夹下
      upNpmString += `  ${currentEle}@latest  `;
    }
    await runOtherCode(upNpmString);
  }
  log && _p(pen.cyan(`正在更新 dev 依赖`));
  // npm 会自动把其安装在父级类文件夹下
  await runOtherCode(`npm update --save`);
  log && cursorMoveUp(`开发依赖更新完毕`);
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
  const currentWordDirectory = getDirectoryBy('package.json', 'file');
  if (currentWordDirectory == undefined) return [];
  // 获取文件
  const packageInfo =
    readFileToJsonSync(pathJoin(currentWordDirectory, 'package.json')) || {};
  const name = packageInfo.name;
  const version = packageInfo.version;
  if (!version) {
    _p(pen.hex('#25f9aa')(`未检测到当前包 ${name} 的版本号`));
    return [];
  }
  const tempInfo = await getNpmPkgInfo(name);
  if (Object.keys(tempInfo).length == 0) {
    return [version];
  }
  // 当前显示的包名与后台抓来的不一致，可能是当前包尚未发布。或者抓取错误
  if (tempInfo.name !== name) return [version];
  if (log) {
    /// 本地的版本展示
    const localVersion = pen.hex('#931')(`当前包本地版本为: ${version}`);
    _p(localVersion);
    const blankSpace = '\x20'.repeat(6);
    // 线上版本
    let onlineVersion = `${blankSpace}线上版本为：${tempInfo.version}`;
    onlineVersion +=
      tempInfo.version == version ? '' : pen.hex('#668')('（线上更新有延迟）');
    _p(pen.hex('#399')(onlineVersion));

    const publishTime = new Date(tempInfo.capsule.lastPublish.time).getTime();
    _p(publishTime.toString());
  }
  return [version, tempInfo.version];
}
/** 光标上移并清理该行 */
function cursorMoveUp(message: string) {
  moveUp();
  cursorAfterClear();
  _p(message);
}
