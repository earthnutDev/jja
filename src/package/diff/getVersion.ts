import {
  getDirectoryBy,
  getNpmPkgInfo,
  npmPkgInfoType,
  PackageJson,
  pathJoin,
  readFileToJsonSync,
} from 'a-node-tools';
import { isUndefined } from 'a-type-of-js';

/**
 *
 * 获取 pkg 包版本信息
 *
 * 有两个地方使用该数据，然而，在 updateNpm 中的使用已彻底移除
 *
 * 为了兼容 ts ，不更改返回值的类型
 *
 */
export async function getVersion(): Promise<
  [string, string, PackageJson | null, npmPkgInfoType | null]
> {
  /// 当前工作目录
  const currentWordDirectory = getDirectoryBy('package.json', 'file');

  if (isUndefined(currentWordDirectory)) return ['', '', null, null];
  // 获取文件
  const packageInfo: PackageJson =
    readFileToJsonSync(pathJoin(currentWordDirectory, 'package.json')) || {};

  const name = packageInfo.name;
  const version = packageInfo.version;

  const inlineInfo: npmPkgInfoType | null = await getNpmPkgInfo(name, '淘宝');

  return [
    version || '',
    (inlineInfo && inlineInfo.version) || '',
    packageInfo,
    inlineInfo,
  ];
}
