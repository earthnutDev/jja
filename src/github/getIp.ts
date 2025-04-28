import { byDns } from './byDns';
import { byHttp } from './byHttp';
import { byPing } from './byPing';

/**
 *
 * 获取 github.com 的 ip 地址
 *
 */
export async function getIp() {
  await byDns();
  await byPing();
  await byHttp();
}
