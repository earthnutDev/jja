import { runOther } from './src/todo/runOther';
import command from 'src/command';
import remove, { removeBind } from './src/remove';
import update, { updateBind } from './src/update';
import { packageBind, packageManage } from 'src/package';
import { clearScreen, clearScreenBind } from 'src/clearScreen';
import git, { gitBind } from 'src/git';

// 绑定命令
command
  .bind({
    ...removeBind,
    ...updateBind,
    ...packageBind,
    ...clearScreenBind,
    ...gitBind,
    // ...runOtherBind,
  })
  .run().isEnd.end;

const arg = command.args.$arrMap;

/** 根据用户的参数 */
async function run() {
  // 若为空数组
  if (arg.length == 0) return;
  const t = arg.shift();
  if (t == undefined) {
    return;
  }
  switch (Object.keys(t)[0]) {
    case 'remove':
      await remove(t.remove);
      break;
    case 'update':
      await update(t.update);
      break;
    case 'clearScreen':
    case 'clearTerminal':
      await clearScreen();
      break;
    case 'package':
      await packageManage(t.package);
      break;
    case 'runOther':
      await runOther(t.runOther);
      break;
    case 'git':
      await git(t.git);
      break;
    default:
      break;
  }
  await run();
}
// 当解析到用户参数
run();
