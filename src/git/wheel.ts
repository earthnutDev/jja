import { command } from 'src/command';
import { beforeTagCommit } from './beforeTagCommit';
import { gitCommit } from './gitCommit';
import { gitMerge } from './gitMerge';

/**
 *
 * 循环执行
 *
 */
export async function wheel(params: {
  commit?: (string | number | boolean)[] | undefined;
  merge?: (string | number | boolean)[] | undefined;
  tag?: (string | number | boolean)[] | undefined;
}) {
  if (params.commit) {
    /** 提交代码 */
    await gitCommit(params.commit.join(' '));
  } else if (params.merge) {
    /** 合并代码 */
    await gitMerge(params.merge.join(''));
  } else if (params.tag) {
    await beforeTagCommit();
  } else command.help('git');
}
