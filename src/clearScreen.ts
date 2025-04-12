import { _p, isTTY } from 'a-node-tools';
import readline from 'node:readline';

/** 导出清理屏幕 */
export function clearScreen() {
  if (isTTY()) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  } else {
    _p('当前环境不支持 ');
  }
}
