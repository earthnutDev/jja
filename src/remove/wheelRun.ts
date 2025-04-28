import { greenPen } from './../pen';
import { dog } from './../dog';
import { _p } from 'a-node-tools';

/** 轮回执行 */
export async function wheelRun<T>(
  callFn: (...param: unknown[]) => T,
  params: unknown[],
  count: number = 5,
): Promise<T> {
  const result = await Reflect.apply(callFn, undefined, params);
  if (!result && count--) {
    _p(greenPen('执行失败，现在重试中'));
    dog.warn(params, '执行失败，第', 5 - count, '次执行');
    return (await wheelRun(callFn, params, count)) as T;
  }
  return await Reflect.apply(callFn, undefined, params);
}
