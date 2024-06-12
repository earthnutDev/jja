import { isWindows } from "ismi-node-tools"
import { execSync } from "node:child_process"

/** 到处清理屏幕的信息 */
export const clearScreenBind = {
  "clearScreen <cls> (清理终端显示屏幕，同 clearTerminal )": "",
  "clearTerminal  <clear>  (清理终端显示屏幕，同 clearScreen )": ""
};


/*** 导出清理屏幕 */
export async function clearScreen() {
  execSync(isWindows ? 'cls' : 'clear', { stdio: [0, 1, 2] });
}