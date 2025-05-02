import { _p } from 'a-node-tools';
import { everyThreePlusBackslash } from './everyThreePlusBackslash';
import pen, { terminalRegExp } from 'color-pen';
import { copyTextToClipboard } from '@qqi/copy-text';
import { pen666 } from 'src/pen';

/**
 *
 * 安装方式
 *
 */
export async function installation(options: {
  msg: string;
  list: string[];
  type: 'brightGreen' | 'brightMagenta' | 'brightRed';
  copy?: boolean;
}) {
  const { msg, list, type, copy } = options;
  const colorPen = pen[type];
  _p();
  _p(colorPen.reversed(msg), false);
  _p(copy ? pen666.reversed`已复制到剪切板 📋` : '');
  _p();
  _p(`${colorPen`npm install --save`} \\\n${everyThreePlusBackslash(list)}`);
  _p();
  if (copy) {
    await copyTextToClipboard(
      `npm install --save ${list.join(' ')}`.replace(terminalRegExp, ''),
    );
  }
}
