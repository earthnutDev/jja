import { getNpmPkgInfo, npmPkgInfoType } from 'a-node-tools';
import { isNull } from 'a-type-of-js';

/**
 * 获取给定包的最新版本号
 */
export async function getLatestVersion(pkgName: string) {
  const result: npmPkgInfoType | null = await getNpmPkgInfo(pkgName);
  if (isNull(result)) {
    return ['', ''];
  }

  const { 'dist-tags': tags, time } = result;

  /**  最后发布的版本  */
  let lastVersion: string = result.version,
    /**  最后发布的标签  */
    lastTag: string = 'latest';

  const tagKey = Object.keys(tags);

  for (let i = 0, j = tagKey.length; i < j; i++) {
    const tag = tagKey[i];
    const version = tags[tag];
    if (time[version] > time[lastVersion]) {
      lastVersion = version;
      lastTag = tag;
    }
  }

  if (lastTag === 'latest') {
    return [result.version, ''];
  } else {
    return [result.version, lastVersion];
  }
}
