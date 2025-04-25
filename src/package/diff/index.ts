import { dog } from './../../dog';
import pen from 'color-pen';

import { getVersion } from './getVersion';
import { _p } from 'a-node-tools';
import { isNull } from 'a-type-of-js';
import { dependencies } from './dependencies';
import { diffData } from './data-store';

/** 检测当前包状态
 *
 * @returns 返回为一个 Promise ，可捕获值为一个数组
 * - 当数组为空，则证明当前未找到包 package.json
 * - 当数组仅有一个值，可能该包尚未上线
 * - 当数组为两个元素，第一个元素是当前的版本号，第二个元素是线上的版本号
 */
export async function diffPackage(): Promise<void> {
  /// 当前工作目录
  await getVersion();

  const { local, online } = diffData;

  const version = local?.version || '';
  const onlineVersion = online?.version || '';

  if (isNull(local)) {
    dog('未找到包 package.json 文件退出');
    return _p(pen.hex('#931')(`未找到当前包 package.json`));
  }

  /// 本地的版本展示
  const localVersion = pen.hex('#931')(`当前包本地版本为: ${version}`);
  _p(localVersion);
  if (isNull(online)) {
    _p(pen.hex('#399')(`未获取当前包的线上信息`));
  } else {
    const blankSpace = '\x20'.repeat(6);
    // 线上版本
    const onlineVersionStr = `${blankSpace}线上版本为：${onlineVersion}@latest`;

    _p(pen.hex('#399')(onlineVersionStr));

    const publishTime = new Date(
      (online && online.time.modified) || '',
    ).toLocaleString();

    _p(publishTime.toString());
  }

  await dependencies();
}
