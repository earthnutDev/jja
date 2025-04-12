import {
  _p,
  getDirectoryBy,
  getNpmPkgInfo,
  npmPkgInfoType,
  pathJoin,
  readFileToJsonSync,
} from 'a-node-tools';
import { isNull, isUndefined } from 'a-type-of-js';
import pen from 'color-pen';
import { command } from 'src/command';

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
  if (isUndefined(currentWordDirectory)) return [];
  // 获取文件
  const packageInfo =
    readFileToJsonSync(pathJoin(currentWordDirectory, 'package.json')) || {};
  const name = packageInfo.name;
  const version = packageInfo.version;
  if (!version) {
    _p(pen.hex('#25f9aa')(`未检测到当前包 ${name} 的版本号`));
    return [];
  }
  const tempInfo: npmPkgInfoType | null = await getNpmPkgInfo(name);
  if (isNull(tempInfo)) {
    return command.error();
  }
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

    const publishTime = new Date(tempInfo.time.modified).toLocaleString();

    _p(publishTime.toString());
  }
  return [version, tempInfo.version];
}
