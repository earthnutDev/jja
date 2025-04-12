import { _p } from 'a-node-tools';

/** 打印清理结果 */
export function removeResult(element: string, result: boolean | undefined) {
  _p(`清理 ${element} 文件${result ? '完成' : '失败'}`);
}
