import { command } from './../../command';
import { pen399 } from './../../pen';
import { cursorAfterClear, cursorLineClear, cursorMoveUp } from 'a-node-tools';
import { getInstallVersion } from './getInstallVersion';
import { getLatestVersion } from './getLatestVersion';
import { diffData } from './data-store';
import { greenPen, strInOneLineOnTerminal } from 'color-pen';
import { sleep } from 'a-js-tools';

/**
 *
 */
export async function diffVersion(): Promise<void> {
  const { dependenceList, timeoutDependence } = diffData;
  /**  包名列表  */
  const keys = Object.keys(dependenceList);
  /**  是否清理旧的输出  */
  let clearLine = false;

  const moveUpAndClear = () => {
    cursorMoveUp(); // 光标上移
    cursorLineClear(true);
    cursorAfterClear(true); // 清理该行
  };

  for (let i = 0, j = keys.length; i < j; i++) {
    const key = keys[i];
    const pkgInfo = dependenceList[key];
    /**  package.json 中指定的版本  */
    const pkgLocalVersion = dependenceList[key].version;
    if (clearLine) moveUpAndClear();

    command.CURRENT(strInOneLineOnTerminal(`获取 ${key} 的本地安装信息`));
    await sleep(36);
    moveUpAndClear();
    const pkgLocalInstallVersion = getInstallVersion(key);
    command.SUCCESS(
      strInOneLineOnTerminal(`${key} 的本地安装版本：${pkgInfo.localVersion}`),
    );
    await sleep(36);
    /**  本地安装的版本  */
    await getLatestVersion(key); // 获取给定包的最新版本号
    moveUpAndClear();
    if (pkgInfo.onlineVersion === '' && pkgInfo.latestVersion === '') {
      timeoutDependence.push(key); // 将超时的包加入超时包列表
      command.ERROR(`${key}  本地 ${pkgInfo.localVersion} 请求错误`);
      clearLine = false;
      continue;
    }

    // 安装版本即最后发布的 latest 版本
    if (pkgLocalInstallVersion === pkgInfo.onlineVersion) {
      let message = `${key} 的本地${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}  最新是 ${pkgInfo.onlineVersion} `;
      // 没有预发布版本
      if ('' === pkgInfo.latestVersion) {
        command.INFO(strInOneLineOnTerminal(message)); // 打印消息
        clearLine = true;
        await sleep(36);
        continue;
      }
      clearLine = false; // 清理该行
      diffData.preReleaseDependence.push(key);
      message += `；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`;
      command.INFO(message);
      await sleep(36);
      continue;
    }
    clearLine = false;
    // 该包现安装的本就是最新的预发布版本
    if (pkgLocalInstallVersion === pkgInfo.latestVersion) {
      command.INFO(
        `${key} 的本地版本${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}`,
      );
      await sleep(36);
      continue;
    }

    let message = `${key} 的本地 ${greenPen(pkgLocalVersion)} 安装版本为 ${greenPen(pkgLocalInstallVersion)}  最新是 ${pen399(pkgInfo.onlineVersion)} `;
    // 最新版本为 latest
    diffData.latestDependence.push(key);

    // 没有最后发布的版本
    if ('' === pkgInfo.latestVersion) {
      command.INFO(message);
      await sleep(36);
      continue;
    }

    diffData.preReleaseDependence.push(key);
    message += `；最新预发布版本为 ${greenPen(pkgInfo.latestVersion)}`;
    command.INFO(message);
    await sleep(36);
  }

  // 最后一个元素如果需要清理则清理
  if (clearLine === true) {
    moveUpAndClear();
    clearLine = false;
  }
}
