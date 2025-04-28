import { italicPen } from '../../pen';
import { _p } from 'a-node-tools';
import { diffVersion } from './diffVersion';
import pen, { strInOneLineOnTerminal } from 'color-pen';
import { diffData } from './data-store';
import { isNull } from 'a-type-of-js';
import { installation } from './installation';
import { latestPen } from './latestPen';
import { tagPen } from './tagPen';

/**
 *
 * 查看依赖版本信息的数据
 *
 */
export async function dependencies() {
  const { local, preReleaseDependence, latestDependence, dependenceList } =
    diffData;

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

  _p(pen.brightGreen`\n版本差异的依赖为：\n`);

  _p(
    [...latestDependence, ...preReleaseDependence]
      .map(item => {
        const info = dependenceList[item];
        const str = pen.random`- `.concat(
          `${info.type === 'dependencies' ? pen.bold(item) : pen.italic(item)}：于${pen.color('#066')(info.time)} 发布 ${info.latestVersion || italicPen(info.onlineVersion)}`,
        );
        return strInOneLineOnTerminal(str);
      })
      .join('\n'),
  );
  _p(
    pen.brightRed(
      `\n目前仅关注版本号是否为最新 ${pen.brightMagenta('latest')}`,
    ),
  );
  _p('使用 npm install --save 命令安装更新\n');

  /**  激进派  */
  const radicals = [
    ...latestDependence
      .filter(i => preReleaseDependence.includes(i) === false)
      .map(i => pen.bold(i).concat('@latest')),
    ...preReleaseDependence.map(i => tagPen(i, dependenceList[i].tag)),
  ];
  /**  保皇派  */
  const royalist = latestDependence.map(i => latestPen(i));

  /** 保守派   */
  const conservatives = [
    ...latestDependence.map(i => latestPen(i)),
    ...preReleaseDependence
      .filter(i => latestDependence.includes(i) === false)
      .map(i => tagPen(i, dependenceList[i].tag)),
  ];

  if (
    // 预发布的数量高于 0
    preReleaseDependence.length > 0
  ) {
    const allLen = preReleaseDependence.length + latestDependence.length;
    // 有重叠才可以
    if (radicals.length < allLen) {
      installation({
        msg: '‼️ 预发布版本优先：',
        list: radicals,
        type: 'brightRed',
      });
    }

    installation({
      msg: '⚠️  latest 版本优先：',
      list: conservatives,
      type: 'brightMagenta',
    });
  }

  if (latestDependence.length > 0) {
    installation({ msg: '🎉 最佳安装：', list: royalist, type: 'brightGreen' });
  }
}
