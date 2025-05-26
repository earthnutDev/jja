import { isUndefined } from 'a-type-of-js';
import { command } from '../command';
import { tagCommit } from './tagCommit';

/** 打 tag 之前 */
export async function beforeTagCommit() {
  const tag = await command.question({
    text: '请输入待标记的信息',
    private: true,
  });

  if (isUndefined(tag)) {
    return;
  }

  await tagCommit(tag);
}
