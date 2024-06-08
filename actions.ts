import command from "src/com";
import remove from './src/remove';
import update from './src/update';

// 获取用户参数
const arg: { name: string }[] = command.args.$arrMap as any;

console.log(arg);


/** 根据用户的参数 */
async function run() {
  let t: { [key: string]: any } = arg.pop() as any;
  const name = Object.keys(t)[0];
  name == 'remove' && (await remove(t.remove), 1) || name == 'update' && (await update(t.update), 1);
  arg.length > 0 && await run();
}
// 当解析到用户参数
arg.length > 0 && run();