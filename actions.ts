import { runOther, runOtherBind } from './src/runOther';
import command from "src/command";
import remove, { removeBind } from './src/remove';
import update, { updateBind } from './src/update';
import { ParamsDataType } from "src/types";
import { packageBind, packageManage } from "src/package";
import { clearScreen, clearScreenBind } from "src/clearScreen";
import git, { gitBind } from "src/git";

// 绑定命令
command
  .bind({
    ...removeBind,
    ...updateBind,
    ...packageBind,
    ...clearScreenBind,
    ...gitBind,
    ...runOtherBind
  })
  .run()
  .isEnd
  .end;

/**  获取用户参数 （由于插件 ismi-command 内部错误，这里添加了判断，倘若依赖更新，这里可视情况去除） */
const arg = (process.argv.slice(2).length > 0 && command.args.$arrMap) || [];

/** 根据用户的参数 */
async function run() {
  // 若为空数组
  if (arg.length == 0) return;
  let t: { [key: string]: ParamsDataType } = arg.shift() as any;
  switch (Object.keys(t)[0]) {
    case 'remove':
      await remove(t.remove);
      break;
    case "update":
      await update(t.update);
      break;
    case "clearScreen":
    case "clearTerminal":
      await clearScreen()
      break;
    case "package":
      await packageManage(t.package);
      break;
    case "runOther":
      await runOther(t.runOther);
      break;
    case "git":
      await git(t.git);
      break;
    default:
      break;
  }
  await run();
}
// 当解析到用户参数
run();