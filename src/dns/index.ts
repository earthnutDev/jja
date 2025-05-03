import { dataStore } from './data-store';
import { ArgsArrMapItemType } from 'a-command/types/args';
import { dnsParam } from 'src/types';
import { printResult } from './printResult';
import { getIp } from './getIp';
import { getLocalIp } from './getLocalIp';
import { printNotFound } from './printNotFound';

/**
 *
 * 与 github 相关的命令
 *
 */
export async function dns(params: ArgsArrMapItemType<dnsParam>) {
  dataStore.reset(params.options);
  await getLocalIp();
  await getIp();

  const { ips } = dataStore;

  if (Object.keys(ips).length > 0) {
    await printResult();
  } else {
    await printNotFound();
  }
}
