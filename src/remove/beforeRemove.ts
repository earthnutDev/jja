import { dog } from './../dog';
import pen from 'color-pen';
import { removeData } from './removeData';
import { _p, fileExist } from 'a-node-tools';
import { wheelRun } from './wheelRun';
import { removeFileOrDirectory } from './removeFileOrDirectory';
import { isUndefined } from 'a-type-of-js';

/** 移除文件前检测 */
export async function beforeRemove(element: string) {
  if (!removeData.log) {
    _p(pen.hex('#336')(`当前清理文件为 ${element}`));
  }
  /**  仅作判断用 */
  const justForJudgment = fileExist(element);
  if (!removeData.log) {
    _p(pen.hex('#666')(`正在检测 ${element} 文件/夹是否存在`));
  }
  dog(`文件${element} 数据为 ${justForJudgment}`);
  if (!isUndefined(justForJudgment)) {
    await wheelRun(
      removeFileOrDirectory as (...param: unknown[]) => Promise<boolean>,
      [element, justForJudgment],
    );
  } else if (!removeData.log) {
    _p(pen.yellow(`${element} 文件不存在`));
  }
}
