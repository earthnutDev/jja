import { dog } from './../dog';
import { ArgsArrMapOptions } from 'a-command/types/args';
import { githubParam } from 'src/types';
import { byDns } from './byDns';
import { byHttp } from './byHttp';
import { byPing } from './byPing';

/**
 * 论会执行
 */
export async function wheel(currentOptions: ArgsArrMapOptions<githubParam>) {
  if (currentOptions['--dns']) {
    dog('执行使用 dns 查询 github.com 的 ip');
    await byDns();
  } else if (currentOptions['--http']) {
    dog('执行使用 http 查询 github.com 的 ip');
    await byHttp();
  } else if (currentOptions['--ping']) {
    dog('执行使用 ping 查询 github.com 的 ip');
    await byPing();
  }
}
