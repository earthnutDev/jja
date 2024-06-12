import { Command } from "ismi-command";
import { test } from "node:test";
import command from "src/command";
// import { clearScreenBind, packageBind, removeBind, updateBind } from "src/com";
// import remove from 'src/remove';
import update from 'src/update';

/** 绑定信息 */
// const bindData = {
//   ...packageBind,
//   ...removeBind,
//   ...updateBind,
//   ...clearScreenBind
// }

/** 测试移除文件或是文件夹 */
test("remove", (t) => {
  process.argv.push("-v");
  console.log(process.argv);

  command.isEnd;
  // const command = new Command("1231");
  // command.bind(bindData).run();

  // // 获取用户参数
  // const arg = command.getArgs;

  // const arrArg = arg.$arrMap;

  // /** 根据用户的参数 */
  // async function run() {
  //   let t: any = arrArg.pop();
  //   t.name == 'remove' && (await remove(t), 1) || t.name == 'update' && (await update(t), 1);
  //   arg.length > 0 && await run();
  // }
  // // 当解析到用户参数
  // arg.length > 0 && run();
});