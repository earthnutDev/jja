import { dog } from './../dog';
import { ArgsArrMapItemType } from 'a-command/types/args';
import { githubParam } from '../types';
import { isUndefined } from 'a-type-of-js';
import { wheel } from './wheel';
import { getIp } from './getIp';

/**
 *
 * 与 github 相关的命令
 *
 */
export async function github(params: ArgsArrMapItemType<githubParam>) {
  const paramList = params.options;

  if (isUndefined(paramList) || paramList.length === 0) {
    dog.warn('没有配置项，直接使用所有的方式获取 github.com 的 IP 地址');
    return await getIp();
  }

  for (const currentOptions of paramList) {
    dog('当前选项', currentOptions);
    await wheel(currentOptions);
  }
}
