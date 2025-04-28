import { italicPen } from '../../pen';

/**
 * 除了 latest 其他标签的色值为任意色
 */
export function tagPen(pkgName: string, tag: string) {
  return `${italicPen(pkgName)}@${italicPen.random(tag)}`;
}
