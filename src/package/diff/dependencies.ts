import { _p, PackageJson } from 'a-node-tools';
import { diffVersion } from './diffVersion';
import pen from 'color-pen';

/**
 *
 * 查看依赖版本信息的数据
 *
 */
export async function dependencies(localInfo: PackageJson) {
  const { dependencies, devDependencies } = localInfo;

  const result = await diffVersion({
    ...(dependencies || {}),
    ...(devDependencies || {}),
  });

  if (result.length === 0) {
    _p('看起来似乎没有依赖版本差异');
    return;
  }

  _p('');
  _p('版本差异的依赖为：');
  _p(result);
  _p(
    pen.brightRed(
      `仅关注版本号是否为最新 ${pen.brightMagenta('latest')}\n不关心是否是最佳依赖版本\n更新有风险，且更且珍惜`,
    ),
  );
  _p('使用 npm install --save 命令安装更新');
  _p(
    'npm install --save '.concat(
      result.map(e => e.concat('@latest')).join('  '),
    ),
  );
}
