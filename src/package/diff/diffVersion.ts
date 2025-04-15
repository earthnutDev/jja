import { _p } from 'a-node-tools';
import { getInstallVersion } from './getInstallVersion';
import { getLatestVersion } from './getLatestVersion';
import pen from 'color-pen';

/**
 *
 */
export async function diffVersion(
  value: Record<string, string>,
): Promise<string[]> {
  const keys = Object.keys(value);
  const result: string[] = [];
  for (let i = 0, j = keys.length; i < j; i++) {
    const key = keys[i];
    const pkgLocalVersion = value[key];
    const latestVersion = await getLatestVersion(key);
    const pkgLocalInstallVersion = getInstallVersion(key);
    if (
      pkgLocalInstallVersion === latestVersion &&
      pkgLocalVersion.includes(latestVersion)
    ) {
      _p(
        `${key} 的本地${pkgLocalVersion} 安装版本为 ${pkgLocalInstallVersion}  最新是 ${latestVersion}`,
      );
    } else {
      result.push(key);
      _p(
        `${key} 的本地 ${pen.brightGreen(pkgLocalVersion)} 安装版本为 ${pen.brightGreen(pkgLocalInstallVersion)}  最新是 ${pen.brightMagenta(latestVersion)}`,
      );
    }
  }
  return result;
}
