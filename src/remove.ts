import { _p, Color, fileExist, isWindows, runOtherCode } from 'a-node-tools';
import { Stats } from 'node:fs';
import { ArgsMapItemType } from 'a-command/types/args';

/** 导出删除文件的绑定信息    */
export const removeBind = {
  'remove <rm> (做一个简单的兼容的移除文件或文件夹的命令)': [
    '--ignore <-i> (不打印日志（默认打印的）)',
    '--subdirectories <-s> (这是一个危险的命令，用于 windows 下递归删除执行命令下所有的给定文件名称)',
  ],
};

/**  是否打印日志  */
const removeData = {
  /** 是否打印日志 */
  log: false,
  /**是否在 windows 下清理所有的同名文件  */
  subdirectories: false,
};

/** 移除文件或是目录 */
export default async function (remove: ArgsMapItemType) {
  /** 删除参数 */
  const delArr = remove.value || [];
  /** 具体要移除的文件 */
  /** 是否不打印移除信息 */
  const noLogInfo = remove['--ignore'],
    /** 是否在 windows 下执行文件的递归查询 */
    subdirectories = remove['--subdirectories'];
  // 解析参数
  if (noLogInfo) {
    removeData.log = true;
    delArr.concat(noLogInfo);
  }
  if (subdirectories) {
    removeData.subdirectories = true;
    delArr.concat(subdirectories);
  }

  if (!removeData.log)
    _p(
      Color.darkCyan(
        '当前系统为: '.concat(isWindows ? 'windows' : 'linux/mac'),
      ),
    );
  delArr.length == 0 && _p(Color.random('没有待清理的文件/文件夹'));
  /// 反着清理
  while (delArr.length) await beforeRemove(delArr.pop() as string);
}

/** 移除文件前检测 */
async function beforeRemove(element: string) {
  !removeData.log && _p(Color.fromRgb(`当前清理文件为 ${element}`, '#336'));
  /**  仅作判断用 */
  const justForJudgment = fileExist(element);
  !removeData.log &&
    _p(Color.fromRgb(`正在检测 ${element} 文件/夹是否存在`, '#666'));
  if (justForJudgment) {
    await wheelRun(
      removeFileOrDirectory as (...param: unknown[]) => Promise<boolean>,
      [element, justForJudgment],
    );
  } else {
    !removeData.log && _p(Color.yellow(`${element} 文件不存在`));
  }
}

/** 轮回执行 */
async function wheelRun<T>(
  callFn: (...param: unknown[]) => T,
  params: unknown[],
  count: number = 5,
): Promise<T> {
  const result = await Reflect.apply(callFn, undefined, params);
  if (!result && count--) {
    _p(Color.green('执行失败，现在重试中'));
    return (await wheelRun(callFn, params, count)) as T;
  }
  return await Reflect.apply(callFn, undefined, params);
}

/** 移除文件或是目录 */
async function removeFileOrDirectory(
  element: string,
  justForJudgment: Stats,
): Promise<boolean> {
  !removeData.log &&
    _p(Color.fromRgb(` ${element} 文件/夹存在，准备删除`, '#aaa'));
  let result: {
    error: unknown;
    success?: boolean | undefined;
    data?: unknown;
  } = { error: null };

  if (isWindows) {
    if (justForJudgment.isDirectory()) {
      result = await runOtherCode(`rd /q /s  ${element.replace(/\//, '\\')}`);
      removeResult(element, result.success);
      // rmdirSync(element, { force: true, recursive: true });
    } else if (justForJudgment.isFile()) {
      // rmSync(element, { force: true });
      result = await runOtherCode({
        code: `del  ${
          removeData.subdirectories ? '/s' : ''
        }  /q  ${element.replace(/\//, '\\')}`,
      });
      removeResult(element, result.success);
    }
  } else {
    result = await runOtherCode({
      code: `rm -rf  ${element.replace(/\\/, '/')}`,
    });
    removeResult(element, result.success);
  }
  if (!result.success) return console.log(result.error) !== undefined;
  return true;
}

/** 打印清理结果 */
function removeResult(element: string, result: boolean | undefined) {
  _p(`清理 ${element} 文件${result ? '完成' : '失败'}`);
}
