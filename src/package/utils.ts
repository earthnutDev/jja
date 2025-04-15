import { cursorMoveUp as moveUp, _p, cursorAfterClear } from 'a-node-tools';

/** 光标上移并清理该行 */
export function cursorMoveUp(message: string) {
  moveUp();
  cursorAfterClear();
  _p(message);
}
