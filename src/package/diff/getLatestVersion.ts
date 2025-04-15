import { getNpmPkgInfo } from 'a-node-tools';
import { isNull } from 'a-type-of-js';

/**
 * 获取给定包的最新版本号
 */
export async function getLatestVersion(pkgName: string) {
  const result = await getNpmPkgInfo(pkgName);
  if (isNull(result)) {
    return '';
  }
  return result.version;
}
