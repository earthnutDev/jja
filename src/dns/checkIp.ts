import { dog } from './../dog';
import net from 'node:net';
import { dataStore } from './data-store';
/**
 *
 * 校验 ip 的联通性
 *
 */
export async function checkIp(
  ip: string,
  timeout: number = 3000,
): Promise<boolean | undefined> {
  const { ips, port } = dataStore;

  if (ips[ip] !== undefined) {
    dog(`${ip} 联通性已校验过 ${ips[ip] ? '🔥' : '⛓️‍💥'}`);
    return undefined;
  }

  dog(`校验 ${ip} 的联通性`);

  return new Promise(resolve => {
    const socket = new net.Socket();

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    dog('测试的接口为：', port);

    socket.connect(port, ip);
  });
}
