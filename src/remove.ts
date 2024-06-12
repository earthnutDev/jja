import { Color, fileExist, isWindows, runOtherCode } from "ismi-node-tools";
import { typeOf } from "ismi-js-tools";
import { Stats } from "node:fs";
import { ParamsDataType } from "./types";

/** 导出删除文件的绑定信息    */
export const removeBind = {
  "remove <rm> (做一个简单的兼容的移除文件或文件夹的命令)": [
    "--ignore <-i> (不打印日志（默认打印的）)",
    "--subdirectories <-s> (这是一个危险的命令，用于 windows 下递归删除执行命令下所有的给定文件名称)",
  ],
};

/**  是否打印日志  */
const removeData = {
  /** 是否打印日志 */
  log: false,
  /**是否在 windows 下清理所有的同名文件  */
  subdirectories: false
}

/** 移除文件或是目录 */
export default async function (remove: ParamsDataType) {
  /** 删除参数 */
  const delArr = remove.value || [];
  /** 具体要移除的文件 */
  /** 是否不打印移除信息 */
  const noLogInfo = remove["--ignore"],
    /** 是否在 windows 下执行文件的递归查询 */
    subdirectories = remove["--subdirectories"];
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
    console.log(
      Color.darkCyan("当前系统为: ".concat(isWindows ? "windows" : "linux/mac"))
    );
  delArr.length == 0 && console.log(Color.random("没有待清理的文件/文件夹"));
  while (delArr.length) await beforeRemove(delArr.pop() as string);
}

/** 移除文件前检测 */
async function beforeRemove(element: string) {
  !removeData.log && console.log(Color.red(`当前清理文件为 ${element}`));
  /**  仅作判断用 */
  const justForJudgment = fileExist(element);
  !removeData.log && console.log(Color.darkMagenta(`正在检测 ${element} 文件/夹是否存在`));
  if (justForJudgment) {
    await wheelRun(removeFileOrDirectory, [element, justForJudgment]);
  } else {
    !removeData.log && console.log(Color.yellow(`${element} 文件不存在`));
  }
}

/** 轮回执行 */
async function wheelRun(callFn: any, params: any[], count: number = 5) {
  const result = await Reflect.apply(callFn, undefined, params);
  if (!result) {
    console.log(Color.green('执行失败，现在重试中'));
    await wheelRun(callFn, params, --count);
  }
}

/** 移除文件或是目录 */
async function removeFileOrDirectory(element: string, justForJudgment: Stats) {
  !removeData.log && console.log(Color.darkMagenta(` ${element} 文件/夹存在，准备删除`));
  let result: {
    error: any;
    success?: boolean | undefined;
    data?: any;
  } = { error: null };

  if (isWindows) {
    if (justForJudgment.isDirectory()) {
      result = await runOtherCode(`rmdir \/q \/s  ${element}`);
      removeResult(element, result.success);
      // rmdirSync(element, { force: true, recursive: true });
    } else if (justForJudgment.isFile()) {
      // rmSync(element, { force: true });
      result = await runOtherCode({
        code: `del  ${removeData.subdirectories ? "/s" : ""}  \/q  ${element}`,
      });
      removeResult(element, result.success);
    }
  } else {
    result = await runOtherCode({ code: `rm -rf  ${element}` });
    removeResult(element, result.success);
  }
  if (!(result).success) return console.log(result.error) !== undefined;
  !removeData.log && console.log(Color.darkRed(`清理文件/夹${element}完成`));
  return true
}

/** 打印清理结果 */
function removeResult(element: string, result: boolean | undefined) {
  console.log(`清理 ${element} 文件${result ? "完成" : "失败"}`);
}
