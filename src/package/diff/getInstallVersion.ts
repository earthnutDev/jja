import { PackageJson, pathJoin, readFileToJsonSync } from 'a-node-tools';

/**
 *
 * 获取给定包的本地安装版本
 *
 */
export function getInstallVersion(pkgName: string) {
  const result: PackageJson = readFileToJsonSync(
    pathJoin('node_modules/', pkgName, 'package.json'),
  );

  return result.version || '';
}
