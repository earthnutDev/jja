import { command } from 'src/command';
import { remove } from './src/remove';
import update from './src/update';
import { packageManage } from 'src/package';
import { clearScreen } from 'src/clearScreen';
import git from 'src/git';
import { isUndefined } from 'a-type-of-js';

const arg = command.args.$arrMap;

/** 根据用户的参数 */
async function run() {
  // 若为空数组
  if (arg.length == 0) return;
  // 当前执行的子命令
  const currentSubcommand = arg.shift();

  if (isUndefined(currentSubcommand)) {
    return;
  }

  if ('remove' in currentSubcommand) {
    await remove(currentSubcommand.remove!);
  } else if (
    'clearScreen' in currentSubcommand ||
    'clear' in currentSubcommand
  ) {
    clearScreen();
  } else if ('git' in currentSubcommand) {
    await git(currentSubcommand.git!);
  } else if ('package' in currentSubcommand) {
    await packageManage(currentSubcommand.package!);
  } else if ('update' in currentSubcommand) {
    await update(currentSubcommand.update!);
  }

  await run();
}
// 当解析到用户参数
run();
