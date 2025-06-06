import { dog } from './../../dog';
import {
  getDirectoryBy,
  getNpmPkgInfo,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
} from 'a-node-tools';
import { isNull, isUndefined } from 'a-type-of-js';
import { diffData } from './data-store';

/**
 *
 * 获取 pkg 包版本信息
 *
 * 有两个地方使用该数据，然而，在 updateNpm 中的使用已彻底移除
 *
 * 为了兼容 ts ，不更改返回值的类型
 *
 */
export async function getVersion(): Promise<void> {
  /// 当前工作目录
  const currentWordDirectory = getDirectoryBy('package.json', 'file');

  if (isUndefined(currentWordDirectory)) {
    dog.warn('未找到当前包的 package.json 文件的位置');
    return;
  }
  // 获取文件
  const packageInfo = readFileToJsonSync<PackageJson>(
    pathJoin(currentWordDirectory, 'package.json'),
  );

  if (isNull(packageInfo)) {
    dog.error('未找到当前包的 package.json 文件，改事件发生的概率极低');
    return;
  }

  /**  包名  */
  const name = packageInfo.name || '';

  const inlineInfo = await getNpmPkgInfo(name, diffData.registry);

  diffData.local = packageInfo;

  diffData.online = inlineInfo.data; // 并不关心 null 不 null
}
