import { _p } from 'a-node-tools';
import { data } from './data';

/** 打印日志 */
export function print(str: string) {
  if (data.log) _p(str);
  return true;
}
