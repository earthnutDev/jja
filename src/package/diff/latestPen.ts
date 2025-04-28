import { boldGreenPen, boldPen } from '../../pen';

/**
 * 用来写彩色的  latest
 */
export function latestPen(pkgName: string) {
  return `${boldPen(pkgName)}@${boldGreenPen`latest`}`;
}
