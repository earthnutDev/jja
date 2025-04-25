import { _p, cursorAfterClear, cursorMoveUp } from 'a-node-tools';
import { getInstallVersion } from './getInstallVersion';
import { getLatestVersion } from './getLatestVersion';
import pen from 'color-pen';
import { diffData } from './data-store';

/**
 *
 */
export async function diffVersion(): Promise<void> {
  const { dependencies } = diffData;
  const keys = Object.keys(dependencies);
  let clearLine = false;

  for (let i = 0, j = keys.length; i < j; i++) {
    const key = keys[i];
    const pkgInfo = dependencies[key];
    /**  package.json 中指定的版本  */
    const pkgLocalVersion = dependencies[key].version;
    await getLatestVersion(key);
    const pkgLocalInstallVersion = getInstallVersion(key);
    if (clearLine) {
      cursorMoveUp(); // 光标上移
      cursorAfterClear(); // 清理该行
    }
    // 安装版本即最后发布的 latest 版本
    if (pkgLocalInstallVersion === pkgInfo.onlineVersion) {
      let message = `${key} 的本地${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}  最新是 ${pkgInfo.onlineVersion} `;
      // 没有预发布版本
      if ('' === pkgInfo.latestVersion) {
        _p(message); // 打印消息
        clearLine = true;
        continue;
      }
      clearLine = false; // 清理该行
      diffData.preReleaseDependence.push(key);
      message += `；最新预发布版本为 ${pen.brightGreen(pkgInfo.latestVersion)}`;
      _p(message);
      continue;
    }
    clearLine = false;
    // 该包现安装的本就是最新的预发布版本
    if (pkgLocalInstallVersion === pkgInfo.latestVersion) {
      continue;
    }

    let message = `${key} 的本地 ${pen.brightGreen(pkgLocalVersion)} 安装版本为 ${pen.brightGreen(pkgLocalInstallVersion)}  最新是 ${pen.brightMagenta(pkgInfo.onlineVersion)} `;
    // 最新版本为 latest
    diffData.latestDependence.push(key);
    if ('' === pkgInfo.latestVersion) {
      _p(message);
      continue;
    }

    diffData.preReleaseDependence.push(key);
    message += `；最新预发布版本为 ${pen.brightGreen(pkgInfo.latestVersion)}`;
    _p(message);
  }

  if (clearLine === true) {
    cursorMoveUp(); // 光标上移
    cursorAfterClear(); // 清理该行
  }
}
