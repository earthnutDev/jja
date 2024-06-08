import { isWindows, runOtherCode } from "ismi-node-tools";

/** terminal 清理 */
export default async function () {
  console.log(12);

  const result = await runOtherCode(isWindows ? 'cls' : "clear");
}