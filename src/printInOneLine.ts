import { _p } from 'a-node-tools';
import { strInOneLineOnTerminal } from 'color-pen';

/**
 *
 * 将文本打印到同一行
 *
 */
export function printInOneLine(str: string) {
  _p(strInOneLineOnTerminal(str));
}
