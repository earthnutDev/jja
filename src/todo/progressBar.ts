import { cursorMoveUp } from "ismi-node-tools";

/** 导出一个进度条 */
export default async function processBar(params: number) {
    cursorMoveUp(2);
}