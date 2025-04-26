import { _p } from 'a-node-tools';
import { diffVersion } from './diffVersion';
import pen from 'color-pen';
import { diffData } from './data-store';
import { isNull } from 'a-type-of-js';

/**
 *
 * 查看依赖版本信息的数据
 *
 */
export async function dependencies() {
  const {
    local,
    preReleaseDependence,
    latestDependence,
    dependencies: dependenceList,
  } = diffData;

  // 值为空直接返回
  if (isNull(local)) {
    return;
  }

  const { dependencies, devDependencies } = local;

  diffData.binning(dependencies);
  diffData.binning(devDependencies, true);

  await diffVersion(); // 分析版本差

  if (preReleaseDependence.length === 0 && latestDependence.length === 0) {
    _p('看起来似乎没有依赖版本差异');
    return;
  }

  _p('\n版本差异的依赖为：');
  _p([...latestDependence, ...preReleaseDependence].join('\n'));
  _p(
    pen.brightRed(
      `仅关注版本号是否为最新 ${pen.brightMagenta('latest')}\n不关心是否是最佳依赖版本\n更新有风险，且更且珍惜`,
    ),
  );
  _p('使用 npm install --save 命令安装更新\n');

  /**  激进派  */
  const radicals = [
    ...latestDependence
      .filter(i => preReleaseDependence.includes(i) === false)
      .map(i => i.concat('@latest')),
    ...preReleaseDependence.map(i => `${i}@${dependenceList[i].tag}`),
  ];
  /**  保皇派  */
  const royalist = latestDependence.map(i => i.concat('@latest'));

  /** 保守派   */
  const conservatives = [
    ...latestDependence.map(i => i.concat('@latest')),
    ...preReleaseDependence
      .filter(i => latestDependence.includes(i) === false)
      .map(i => `${i}@${dependenceList[i].tag}`),
  ];

  if (
    // 预发布的数量高于 0
    preReleaseDependence.length > 0
  ) {
    const allLen = preReleaseDependence.length + latestDependence.length;
    // 有重叠才可以
    if (radicals.length < allLen) {
      _p();
      _p(pen.brightRed.reversed`激进派（预发布版本优先）安装手法：`);
      _p();
      _p(`npm install --save ${radicals.join(' ')}`);
      _p();
    }
    // 判断 < 说明有重叠， 判断 === 0 是在上一个不会被打印出来时保证有关于予发布版本
    if (latestDependence.length === 0 || conservatives.length < allLen) {
      _p();
      _p(pen.brightMagenta.reversed`保守派（latest 版本优先）安装手法：`);
      _p();
      _p(`npm install --save ${conservatives.join(' ')}`);
      _p();
    }
  }

  if (latestDependence.length > 0) {
    _p();
    _p(pen.brightGreen.reversed`保皇派（最推荐的）稳妥安装：`);
    _p();
    _p(`npm install --save ${royalist.join(' ')}`);
    _p();
  }
}
