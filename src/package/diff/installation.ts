import { _p } from 'a-node-tools';
import { everyThreePlusBackslash } from './everyThreePlusBackslash';
import pen from 'color-pen';

/**
 *
 * 安装方式
 *
 */
export function installation(options: {
  msg: string;
  list: string[];
  type: 'brightGreen' | 'brightMagenta' | 'brightRed';
}) {
  const { msg, list, type } = options;
  const colorPen = pen[type];
  _p();
  _p(colorPen.reversed(msg));
  _p();
  _p(`${colorPen`npm install --save`} \\\n${everyThreePlusBackslash(list)}`);
  _p();
}
