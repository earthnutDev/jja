import { dog } from './../../dog';
import { getNpmPkgInfo, npmPkgInfoType } from 'a-node-tools';
import { isNull } from 'a-type-of-js';
import { diffData } from './data-store';

/**
 * 获取给定包的最新版本号
 */
export async function getLatestVersion(pkgName: string) {
  const response: npmPkgInfoType | null = await getNpmPkgInfo(pkgName);

  // 非空验证
  if (isNull(response)) {
    dog.warn('获取包信息失败');
    return;
  }

  const pkgInfo = diffData.dependencies[pkgName];

  const { 'dist-tags': tags, time } = response;

  /**  最后发布的版本  */
  let lastVersion: string = response.version,
    lastTag = 'latest';

  pkgInfo.onlineVersion = lastVersion;
  pkgInfo.tag = lastTag;

  const tagKey = Object.keys(tags);

  for (let i = 0, j = tagKey.length; i < j; i++) {
    const tag = tagKey[i];
    const version = tags[tag];
    if (time[version] > time[lastVersion]) {
      lastVersion = version;
      lastTag = tag;
    }
  }
  if (lastTag !== 'latest') {
    dog(pkgName, '最新版本为：', lastVersion, 'tag为：', lastTag);
    pkgInfo.tag = lastTag;
    pkgInfo.latestVersion = lastVersion;
  }
}
