import { Color, fileExist, isWindows, runOtherCode } from "ismi-node-tools";
import { typeOf } from "ismi-js-tools";
import { Stats } from "node:fs";
// 是否打印日志
let log: boolean = false,
  subdirectories = false;

/** 移除文件 */
export default async function (
  remove: string | true | string[] | { [key: string]: string | true | string[] }
) {
  const delArr =
    (typeof remove == "string" && [remove]) ||
      (typeof remove == "boolean" && []) ||
      (typeOf(remove) == "array" && remove) ||
      // @ts-ignore
      (typeof remove == "object" && remove.value == undefined)
      ? []
      : // @ts-ignore
      remove.value.toString().split(",");
  if (typeOf(remove) == "object") {
    // @ts-ignore 这里没毛病
    const ig = remove["--ignore"],
      // @ts-ignore 这里没毛病
      sub = remove["--subdirectories"];
    // 解析参数
    (ig &&
      ((log = true),
        typeof ig !== "boolean" && delArr.push(...ig.toString().split(","))),
      1) &&
      sub &&
      (subdirectories = true) &&
      typeof sub !== "boolean" &&
      delArr.push(...sub.toString().split(","));
  }

  !log &&
    console.log(
      Color.darkCyan("当前系统为: ".concat(isWindows ? "windows" : "linux/mac"))
    );
  delArr.length == 0 && console.log(Color.random("没有要清理的文件/文件夹"));
  while (delArr.length) await beforeRemove(delArr.pop());
}

/** 一处文件前检测 */
async function beforeRemove(element: string) {
  !log && console.log(Color.red(`当前清理文件为 ${element}`));
  /**  仅作判断用 */
  const justForJudgment = fileExist(element);
  !log && console.log(Color.darkMagenta(`正在检测 ${element} 文件/夹是否存在`));
  if (justForJudgment) {
    await removeFileOrDirectory(element, justForJudgment);
  } else {
    !log && console.log(Color.yellow(`${element} 文件不存在`));
  }
}

/** 移除 */
async function removeFileOrDirectory(element: string, justForJudgment: Stats) {
  !log && console.log(Color.darkMagenta(` ${element} 文件/夹存在，准备删除`));
  if (isWindows) {
    if (justForJudgment.isDirectory()) {
      const result = await runOtherCode(`rmdir \/q \/s  ${element}`);
      removeResult(element, result.success);
      // rmdirSync(element, { force: true, recursive: true });
    } else if (justForJudgment.isFile()) {
      // rmSync(element, { force: true });
      const result = await runOtherCode({
        code: `del  ${subdirectories ? "/s" : ""}  \/q  ${element}`,
      });
      removeResult(element, result.success);
    }
  } else {
    const result = await runOtherCode({ code: `rm -rf  ${element}` });
    removeResult(element, result.success);
  }
  !log && console.log(Color.darkRed(`清理文件/夹${element}完成`));
}

function removeResult(element: string, result: boolean | undefined) {
  console.log(`清理 ${element} 文件${result ? "完成" : "失败"}`);
}
