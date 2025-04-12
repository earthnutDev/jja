import { cursorMoveUp } from 'a-node-tools';

/** 导出一个进度条 */
export default async function processBar(params: number) {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  params;
  cursorMoveUp(2);
}
