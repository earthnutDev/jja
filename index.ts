import { dog } from './src/dog';
import { command } from 'src/command';
import { remove } from './src/remove';
import update from './src/update';
import { packageManage } from 'src/package';
import { clearScreen } from 'src/clearScreen';
import git from 'src/git';
import { isUndefined } from 'a-type-of-js';

const arg = command.args.$arrMap;

// 没有匹配到具体的子命令时可返回

if (command.args.$only.length === 0) {
  dog('没有匹配到子命令，打印帮助信息并退出');
  command.help();
  command.end();
}

/** 根据用户的参数 */
async function run() {
  if (arg.length === 0) {
    command.end();
  }
  // 当前执行的子命令
  const currentSubcommand = arg.shift();

  if (isUndefined(currentSubcommand)) {
    return await run();
  }

  if ('remove' in currentSubcommand) {
    dog('执行文件移除');
    await remove(currentSubcommand.remove!);
  } else if (
    'clearScreen' in currentSubcommand ||
    'clear' in currentSubcommand
  ) {
    dog('执行清屏');
    await clearScreen();
  } else if ('git' in currentSubcommand) {
    dog('执行 git 相关命令');
    await git(currentSubcommand.git!);
  } else if ('package' in currentSubcommand) {
    dog('执行 package 相关命令');
    await packageManage(currentSubcommand.package!);
  } else if ('update' in currentSubcommand) {
    dog('执行 update 相关命令');
    await update(currentSubcommand.update!);
  }
  await run();
}

try {
  await run();
} catch (error) {
  dog.error('执行 run 报错', error);
}
