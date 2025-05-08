import { pen666 } from '../../pen';
import { _p } from 'a-node-tools';
import { diffVersion } from './diffVersion';
import { italicPen, pen, redPen, strInOneLineOnTerminal } from 'color-pen';
import { diffData } from './data-store';
import { isNull } from 'a-type-of-js';
import { installation } from './installation';
import { latestPen } from './latestPen';
import { tagPen } from './tagPen';
import { printInOneLine } from '../../printInOneLine';

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
    dependenceList,
    timeoutDependence,
  } = diffData;

  // 值为空直接返回
  if (isNull(local)) {
    return;
  }

  const { dependencies, devDependencies } = local;

  diffData.binning(dependencies);
  diffData.binning(devDependencies, true);

  await diffVersion(); // 分析版本差

  if (
    preReleaseDependence.length === 0 &&
    latestDependence.length === 0 &&
    timeoutDependence.length === 0
  ) {
    _p(pen666`看起来似乎没有依赖版本差异`);
    return;
  } else if (
    preReleaseDependence.length === 0 &&
    latestDependence.length === 0
  ) {
    _p(
      redPen`看起来网络不太好讷，所有的包线上版本的请求都出错了。或者是还没有执行 npm install 呐`,
    );
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

  if (timeoutDependence.length > 0) {
    printInOneLine(redPen`有一些包没有返回结果，请注意：`);
    printInOneLine(
      timeoutDependence.map(e => `${pen.random`-`} ${e}`).join('\n'),
    );
  }

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

  /**  较危险的安装预发布版本的包  */
  const radicalInstall =
    radicals.length < preReleaseDependence.length + latestDependence.length;
  /**  是否安装预发布包（较安全）  */
  const royalistInstall = preReleaseDependence.length > 0;

  /**  仅安装正式版本的最后版本  */
  const conservativesInstall = latestDependence.length > 0;

  if (royalistInstall) {
    // 有重叠才可以
    if (radicalInstall) {
      await installation({
        msg: '‼️ 预发布版本优先：',
        list: radicals,
        type: 'brightRed',
      });
    }

    await installation({
      msg: '⚠️  latest 版本优先：',
      list: conservatives,
      type: 'brightMagenta',
      copy: !conservativesInstall,
    });
  }

  if (conservativesInstall) {
    await installation({
      msg: '🎉 最佳安装：',
      list: royalist,
      type: 'brightGreen',
      copy: true,
    });
  }
}
