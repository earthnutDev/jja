import { _p, cursorAfterClear, cursorMoveUp } from 'a-node-tools';
import { dataStore } from './data-store';
import { isUndefined } from 'a-type-of-js';
import { getIdByDnsServer } from './getIdByDnsServer';
import { greenPen, pen, redPen, strInOneLineOnTerminal } from 'color-pen';
import { dog } from '../dog';
import { orangePen, pen666 } from '../pen';

/**
 *
 * 获取 ip
 *
 */
export async function getIp() {
  const { domain, dnsServers, notCovered } = dataStore;
  let clear = 0;

  _p(`${domain} ip 列表：`);

  for (const server of dnsServers) {
    const { dnsServer, results } = await getIdByDnsServer(server);
    if (isUndefined(results)) {
      dog.warn(`${dnsServer} 获取 ip 失败`);
      continue;
    }
    if (!notCovered && clear !== 0) {
      cursorMoveUp(clear);
      cursorAfterClear(true);
    }

    _p();
    _p(pen.reversed`DNS: ${dnsServer}`);
    _p();
    results.forEach(({ ip, isAlive }) => {
      const message = isAlive
        ? `${greenPen(ip)} ${orangePen`->`}  ✅`
        : `${pen666(ip)} ${redPen`⛓️‍💥`}  ❌`;
      _p(strInOneLineOnTerminal(message));
    });
    clear = 3 + results.length;
  }

  if (!notCovered) {
    cursorMoveUp(clear + 1);
    cursorAfterClear(true);
  }
}
