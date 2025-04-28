import { greenPen, pen399 } from './../../pen';
import { cursorAfterClear, cursorLineClear, cursorMoveUp } from 'a-node-tools';
import { getInstallVersion } from './getInstallVersion';
import { getLatestVersion } from './getLatestVersion';
import { diffData } from './data-store';
import { printInOneLine } from '../../printInOneLine';

/**
 *
 */
export async function diffVersion(): Promise<void> {
  const { dependenceList } = diffData;
  const keys = Object.keys(dependenceList);
  let clearLine = false;

  for (let i = 0, j = keys.length; i < j; i++) {
    const key = keys[i];
    const pkgInfo = dependenceList[key];
    /**  package.json 中指定的版本  */
    const pkgLocalVersion = dependenceList[key].version;
    await getLatestVersion(key);
    const pkgLocalInstallVersion = getInstallVersion(key);
    if (clearLine) {
      cursorMoveUp(); // 光标上移
      cursorLineClear();
      cursorAfterClear(true); // 清理该行
    }
    // 安装版本即最后发布的 latest 版本
    if (pkgLocalInstallVersion === pkgInfo.onlineVersion) {
      let message = `${key} 的本地${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}  最新是 ${pkgInfo.onlineVersion} `;
      // 没有预发布版本
      if ('' === pkgInfo.latestVersion) {
        printInOneLine(message); // 打印消息
        clearLine = true;
        continue;
      }
      clearLine = false; // 清理该行
      diffData.preReleaseDependence.push(key);
      message += `；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`;
      printInOneLine(message);
      continue;
    }
    clearLine = false;
    // 该包现安装的本就是最新的预发布版本
    if (pkgLocalInstallVersion === pkgInfo.latestVersion) {
      continue;
    }

    let message = `${key} 的本地 ${greenPen(pkgLocalVersion)} 安装版本为 ${greenPen(pkgLocalInstallVersion)}  最新是 ${pen399(pkgInfo.onlineVersion)} `;
    // 最新版本为 latest
    diffData.latestDependence.push(key);
    if ('' === pkgInfo.latestVersion) {
      printInOneLine(message);
      continue;
    }

    diffData.preReleaseDependence.push(key);
    message += `；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`;
    printInOneLine(message);
  }

  // 最后一个元素如果需要清理则清理
  if (clearLine === true) {
    cursorMoveUp(); // 光标上移
    cursorLineClear();
    cursorAfterClear(true); // 清理该行
    clearLine = false;
  }
}
