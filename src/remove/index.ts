import { pen } from 'color-pen';
import { _p, isWindows } from 'a-node-tools';
import { ArgsArrMapItemType } from 'a-command/types/args';
import { removeParam } from '../types';
import { removeData } from './removeData';
import { beforeRemove } from './beforeRemove';

/** 移除文件或是目录 */
export async function remove(params: ArgsArrMapItemType<removeParam>) {
  /** 删除参数 */
  const delArr = params.value || [];

  /** 具体要移除的文件 */
  const options = params.options;

  options?.forEach(item => {
    const noLogInfo = item['--ignore'];
    if (noLogInfo) {
      removeData.log = true;
      delArr.concat(noLogInfo);
    }
    const subdirectories = item['--subdirectories'];
    if (subdirectories) {
      removeData.subdirectories = true;
      delArr.concat(subdirectories);
    }
  });

  if (!removeData.log)
    _p(
      pen.brightCyan(
        '当前系统为: '.concat(isWindows ? 'windows' : 'linux/mac'),
      ),
    );
  if (delArr.length == 0) {
    _p(pen.random('没有待清理的文件/文件夹'));
  }
  /// 反着清理
  while (delArr.length) await beforeRemove(delArr.pop() as string);
}
