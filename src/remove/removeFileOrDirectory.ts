import { Stats } from 'node:fs';
import { removeData } from './removeData';
import { _p, isWindows, runOtherCode } from 'a-node-tools';
import { removeResult } from './removeResult';
import { hexPen } from 'color-pen';

/** 移除文件或是目录 */
export async function removeFileOrDirectory(
  element: string,
  justForJudgment: Stats,
): Promise<boolean> {
  if (!removeData.log) {
    _p(hexPen('#aaa')(` ${element} 文件/夹存在，准备删除`));
  }
  let result: {
    error: unknown;
    success?: boolean | undefined;
    data?: unknown;
  } = { error: null };

  if (isWindows) {
    if (justForJudgment.isDirectory()) {
      result = await runOtherCode({
        code: `rd /q /s  ${element.replace(/\//, '\\')}`,
        printLog: false,
      });
      removeResult(element, result.success);
      // rmdirSync(element, { force: true, recursive: true });
    } else if (justForJudgment.isFile()) {
      // rmSync(element, { force: true });
      result = await runOtherCode({
        code: `del  ${
          removeData.subdirectories ? '/s' : ''
        }  /q  ${element.replace(/\//, '\\')}`,
        printLog: false,
      });
      removeResult(element, result.success);
    }
  } else {
    result = await runOtherCode({
      code: `rm -rf  ${element.replace(/\\/, '/')}`,
      printLog: false,
    });
    removeResult(element, result.success);
  }
  if (!result.success) {
    console.log(result.error);
    return false;
  }
  return true;
}
