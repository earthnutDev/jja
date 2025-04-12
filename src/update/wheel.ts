import { updateDependence } from 'src/package/updateDependence';
import { data } from './data';
import { updateNpm } from './updateNpm';

/**
 *
 * 轮回执行
 *
 */
export async function wheel(param: {
  '--ignore'?: (string | number | boolean)[] | undefined;
  '--dependencies'?: (string | number | boolean)[] | undefined;
  '--npm-publish'?: (string | number | boolean)[] | undefined;
}) {
  // 是否想升级 npm
  const npm = param['--npm-publish'],
    // 是否为依赖更新
    dependencies = Boolean(param['--dependencies']);

  // 打算升级 npm 版本
  if (npm) {
    data.npmUpdate = true;
    return await updateNpm();
  } else if (dependencies) {
    /** 需要更新 依赖 */
    await updateDependence(data.log);
  }
}
