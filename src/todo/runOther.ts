import type { ArgsArrMapItemType } from 'a-command/types/args';
import { readFileToJsonSync, runOtherCode } from 'a-node-tools';

/** 导出一个绑定  */
export const runOtherBind = {
  'runOther <run> (执行其他的代码，使用 npm run 的可省略, 若想执行多个命令，请多次使用 run )':
    [],
};

/** 导出执行其他代码 */
export async function runOther(runOther: ArgsArrMapItemType) {
  const { value } = runOther;
  if (value.length == 0) return;

  const packageInfo = readFileToJsonSync('package.json');
  const scripts = packageInfo.scripts;
  /// 倘若执行 npm run 命令
  if (value.length == 1) {
    if (scripts[value[0] as string]) {
      return await runOtherCode(`npm run ${value[0]}`);
    }
  }

  // 抓取第一个
  // const firstCommand = value[0];
  await runOtherCode(value.join(' '));
}
